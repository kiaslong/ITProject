/*
  Warnings:

  - Added the required column `modelApply` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "modelApply" TEXT NOT NULL;
