/*
  Warnings:

  - You are about to drop the column `contact` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Plant` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Plant` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - Added the required column `phone` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "care" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "seller" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Plant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Plant" ("care", "description", "id", "name", "photo", "price") SELECT "care", "description", "id", "name", "photo", "price" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
