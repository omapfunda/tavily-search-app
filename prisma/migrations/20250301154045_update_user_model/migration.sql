/*
  Warnings:

  - You are about to drop the column `organizationId` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Search` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Search" DROP CONSTRAINT "Search_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Search" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "organizationId",
ADD COLUMN     "currentUsage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usageLimit" INTEGER NOT NULL DEFAULT 100;

-- DropTable
DROP TABLE "Organization";
