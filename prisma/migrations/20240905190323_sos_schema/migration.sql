-- DropForeignKey
ALTER TABLE "ComplaintDownvote" DROP CONSTRAINT "ComplaintDownvote_complaintId_fkey";

-- DropForeignKey
ALTER TABLE "ComplaintDownvote" DROP CONSTRAINT "ComplaintDownvote_userId_fkey";

-- DropForeignKey
ALTER TABLE "ComplaintUpvote" DROP CONSTRAINT "ComplaintUpvote_complaintId_fkey";

-- DropForeignKey
ALTER TABLE "ComplaintUpvote" DROP CONSTRAINT "ComplaintUpvote_userId_fkey";

-- CreateTable
CREATE TABLE "sos" (
    "id" TEXT NOT NULL,

    CONSTRAINT "sos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ComplaintUpvote" ADD CONSTRAINT "ComplaintUpvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintUpvote" ADD CONSTRAINT "ComplaintUpvote_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintDownvote" ADD CONSTRAINT "ComplaintDownvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintDownvote" ADD CONSTRAINT "ComplaintDownvote_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
