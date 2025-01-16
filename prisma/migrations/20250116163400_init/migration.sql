-- CreateTable
CREATE TABLE "Warehouse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "stock" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Device" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "kilograms" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "DeviceDiscount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "units" INTEGER NOT NULL,
    "rate" DECIMAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    CONSTRAINT "DeviceDiscount_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" DECIMAL NOT NULL,
    "shippingCost" DECIMAL NOT NULL,
    "discount" DECIMAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    CONSTRAINT "Order_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "units" INTEGER NOT NULL,
    "cost" DECIMAL NOT NULL,
    CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Shipment_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "DeviceDiscount_deviceId_idx" ON "DeviceDiscount"("deviceId");

-- CreateIndex
CREATE INDEX "Order_deviceId_idx" ON "Order"("deviceId");
