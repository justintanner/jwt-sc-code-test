import prisma from '../client'

async function main() {
  // First, create the device with its base information
  const scosDevice = await prisma.device.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'SCOS Station P1 Pro',
      price: 150,
      kilograms: 0.356,
      DeviceDiscount: {
        create: [
          { units: 25, rate: 0.05 },  // 5% discount
          { units: 50, rate: 0.10 },  // 10% discount
          { units: 100, rate: 0.15 }, // 15% discount
          { units: 250, rate: 0.20 }, // 20% discount
        ]
      }
    }
  })

  // Create all warehouses
  const warehouses = await Promise.all([
    prisma.warehouse.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Los Angeles',
        lat: 33.9425,
        lng: -118.408056,
        stock: 355
      }
    }),
    prisma.warehouse.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'New York',
        lat: 40.639722,
        lng: -73.778889,
        stock: 578
      }
    }),
    prisma.warehouse.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'São Paulo',
        lat: -23.435556,
        lng: -46.473056,
        stock: 265
      }
    }),
    prisma.warehouse.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Paris',
        lat: 49.009722,
        lng: 2.547778,
        stock: 694
      }
    }),
    prisma.warehouse.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Warsaw',
        lat: 52.165833,
        lng: 20.967222,
        stock: 245
      }
    }),
    prisma.warehouse.upsert({
      where: { id: 6 },
      update: {},
      create: {
        name: 'Hong Kong',
        lat: 22.308889,
        lng: 113.914444,
        stock: 419
      }
    })
  ])

  console.log({ scosDevice, warehouses })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
