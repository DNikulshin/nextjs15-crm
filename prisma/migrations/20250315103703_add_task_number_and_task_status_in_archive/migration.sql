-- AlterEnum
ALTER TYPE "TaskStatus" ADD VALUE 'inArchive';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "number" SERIAL;
