/*
  Warnings:

  - You are about to drop the column `access_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `User` table. All the data in the column will be lost.
  - Added the required column `data` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "access_token",
DROP COLUMN "id_token",
DROP COLUMN "refresh_token",
DROP COLUMN "scope",
ADD COLUMN     "data" JSONB NOT NULL;
