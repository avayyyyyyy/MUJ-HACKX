/*
  Warnings:

  - You are about to drop the column `downvotes` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Complaint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "downvotes",
DROP COLUMN "upvotes";

-- CreateTable
CREATE TABLE "ComplaintUpvote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "complaintId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplaintUpvote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplaintDownvote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "complaintId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplaintDownvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ComplaintUpvote_userId_complaintId_key" ON "ComplaintUpvote"("userId", "complaintId");

-- CreateIndex
CREATE UNIQUE INDEX "ComplaintDownvote_userId_complaintId_key" ON "ComplaintDownvote"("userId", "complaintId");

-- AddForeignKey
ALTER TABLE "ComplaintUpvote" ADD CONSTRAINT "ComplaintUpvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintUpvote" ADD CONSTRAINT "ComplaintUpvote_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintDownvote" ADD CONSTRAINT "ComplaintDownvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintDownvote" ADD CONSTRAINT "ComplaintDownvote_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
