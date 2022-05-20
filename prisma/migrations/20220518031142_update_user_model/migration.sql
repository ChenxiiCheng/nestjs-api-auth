/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "image" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "password" TEXT NOT NULL;
