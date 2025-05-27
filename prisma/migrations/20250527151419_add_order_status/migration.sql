/*
  Warnings:

  - You are about to drop the column `status` on the `Plant` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "buyerName" TEXT NOT NULL,
    "buyerPhone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "total" REAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("branch", "buyerName", "buyerPhone", "city", "createdAt", "id", "items", "sellerId", "total") SELECT "branch", "buyerName", "buyerPhone", "city", "createdAt", "id", "items", "sellerId", "total" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "care" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "phone" TEXT NOT NULL,
    "sellerId" INTEGER,
    "category" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Plant_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Plant" ("care", "category", "createdAt", "description", "id", "name", "phone", "photo", "price", "sellerId") SELECT "care", "category", "createdAt", "description", "id", "name", "phone", "photo", "price", "sellerId" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
