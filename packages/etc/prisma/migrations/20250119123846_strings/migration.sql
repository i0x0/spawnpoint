/*
  Warnings:

  - Added the required column `name` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "name" TEXT NOT NULL;
