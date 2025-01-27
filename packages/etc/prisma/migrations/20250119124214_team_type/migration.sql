/*
  Warnings:

  - Added the required column `type` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TeamType" AS ENUM ('SINGLE', 'GROUP');

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "type" "TeamType" NOT NULL;
