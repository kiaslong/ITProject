-- AlterTable
ALTER TABLE "Promotion" ALTER COLUMN "makeApply" DROP NOT NULL,
ALTER COLUMN "modelApply" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "ownerResponseTime" SET DEFAULT '0 phút';
