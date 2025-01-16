import prisma from '../client'
import { Prisma, Order, Shipment } from '@prisma/client'
import Big from 'big.js'

async function ship(deviceId: number, quantity: number, lat: number, lng: number, saveOrder: boolean = false): Promise<object> {
  const device = await prisma.device.findUnique({
    where: {id: deviceId},
    include: {
      DeviceDiscount: true
    }
  })

  if (!device) {
    throw new Error('Device not found')
  }

  const applicableDiscounts = device.DeviceDiscount
    .filter(discount => quantity >= discount.units)
    .sort((a, b) => Number(b.units) - Number(a.units))

  const discountRate = applicableDiscounts.length > 0 ? Number(applicableDiscounts[0].rate) : 0

  const warehouses = await prisma.warehouse.findMany()

  const closestWarehouses = warehouses
    .map(warehouse => ({
      ...warehouse,
      distance: kilometersBetween(lat, lng, warehouse.lat, warehouse.lng)
    }))
    .sort((a, b) => a.distance - b.distance)

  let shippingCost = Big(0)

  const shipments: Omit<Shipment, 'id' | 'orderId'>[] = []
  let remainingQuantity = quantity

  for (const warehouse of closestWarehouses) {
    if (remainingQuantity <= 0) break

    const units = Math.min(warehouse.stock, remainingQuantity)

    if (units > 0) {
      const cost = calculateShippingCost(
        warehouse.lat, warehouse.lng,
        lat, lng,
        device.kilograms,
      )

      shipments.push({
        warehouseId: warehouse.id,
        units,
        cost: new Prisma.Decimal(cost.toFixed(2))
      })

      shippingCost = shippingCost.plus(cost.toString())

      remainingQuantity -= units
    }
  }

  const totalPrice = Big(device.price.toString()).times(quantity)
  const discount = totalPrice.times(discountRate)

  if (shippingCost.gt(totalPrice.times(0.15))) {
    throw new Error('Shipping cost exceeds 15% of the total price')
  }

  if (remainingQuantity > 0) {
    throw new Error('Not enough stock across warehouses')
  }

  const orderData = {
    deviceId,
    quantity,
    lat,
    lng,
    totalPrice: new Prisma.Decimal(totalPrice.toFixed(2)),
    shippingCost: new Prisma.Decimal(shippingCost.toFixed(2)),
    discount: new Prisma.Decimal(discount.toFixed(2)),
    Shipment: {
      create: shipments
    }
  }

  if (saveOrder) {
    const order = await prisma.$transaction(async (tx) => {
      for (const shipment of shipments) {
        tx.warehouse.update({
          where: { id: shipment.warehouseId },
          data: { stock: { decrement: shipment.units } }
        })
      }

      return tx.order.create({ data: orderData })
    })

    return { id: order?.id, ...orderData }
  }

  return orderData
}

function calculateShippingCost(
  warehouseLat: number,
  warehouseLng: number,
  destinationLat: number,
  destinationLng: number,
  weightInKg: number
): Number {
  const distance = kilometersBetween(warehouseLat, warehouseLng, destinationLat, destinationLng)

  const ratePerKgPerKm = new Big('0.01')

  const cost = new Big(distance)
    .times(weightInKg)
    .times(ratePerKgPerKm)
    .round(2)

  return Number(cost.toFixed(2))
}

function kilometersBetween(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const earthsRadiusInKm = 6371;

  const deltalat = (lat2 - lat1) * Math.PI / 180;
  const deltalng = (lng2 - lng1) * Math.PI / 180;

  const halfChordLength = Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) * Math.sin(deltalng / 2) *
    Math.sin(deltalng / 2) + Math.sin(deltalat / 2) * Math.sin(deltalat / 2);

  const angularDistance = 2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength));

  return earthsRadiusInKm * angularDistance;
}

export { ship, calculateShippingCost, kilometersBetween }
