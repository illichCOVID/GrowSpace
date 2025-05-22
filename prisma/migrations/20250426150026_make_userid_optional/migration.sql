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
    "userId" INTEGER,
    CONSTRAINT "Plant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Plant" ("care", "description", "id", "name", "phone", "photo", "price", "seller", "userId") SELECT "care", "description", "id", "name", "phone", "photo", "price", "seller", "userId" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
