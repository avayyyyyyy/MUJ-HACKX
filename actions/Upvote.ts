"use server";

import prisma from "@/lib/db";
import { getUserId } from "./saveComplain";
import { revalidatePath } from "next/cache";

export async function upvoteComplaint(complaintId: string) {
  if (!complaintId) {
    throw new Error("Complaint ID is required");
  }

  const userId = await getUserId();

  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    // Check if the user has already upvoted the complaint
    const existingUpvote = await prisma.complaintUpvote.findUnique({
      where: {
        userId_complaintId: {
          userId,
          complaintId,
        },
      },
    });

    if (existingUpvote) {
      // If the user has already upvoted, remove the upvote
      await prisma.complaintUpvote.delete({
        where: {
          userId_complaintId: {
            userId,
            complaintId,
          },
        },
      });

      revalidatePath("/dashboard");
      return { success: true, message: "Upvote removed" };
    } else {
      // User has not upvoted; check if they have downvoted
      const existingDownvote = await prisma.complaintDownvote.findUnique({
        where: {
          userId_complaintId: {
            userId,
            complaintId,
          },
        },
      });

      if (existingDownvote) {
        // Remove the downvote if it exists
        await prisma.complaintDownvote.delete({
          where: {
            userId_complaintId: {
              userId,
              complaintId,
            },
          },
        });
      }

      // Add the upvote
      await prisma.complaintUpvote.create({
        data: {
          userId,
          complaintId,
        },
      });

      revalidatePath("/dashboard");
      return { success: true, message: "Upvoted successfully" };
    }
  } catch (error) {
    console.error("Error upvoting complaint:", error);  
    return false;
  }
}
