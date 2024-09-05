/*
  Warnings:

  - You are about to drop the column `imageLocation` on the `Complaint` table. All the data in the column will be lost.
  - Added the required column `imageLatitude` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageLongitude` to the `Complaint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "imageLocation",
ADD COLUMN     "imageLatitude" TEXT NOT NULL,
ADD COLUMN     "imageLongitude" TEXT NOT NULL;
