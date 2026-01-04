-- CreateTable
CREATE TABLE "DiagramEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hash" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "json" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserSavedDiagram" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "diagramId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserSavedDiagram_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "DiagramEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DiagramEntry_hash_key" ON "DiagramEntry"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "UserSavedDiagram_userId_diagramId_key" ON "UserSavedDiagram"("userId", "diagramId");
