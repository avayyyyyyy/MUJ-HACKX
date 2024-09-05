"use server";

import prisma from "@/lib/db";
import { getUserId } from "./saveComplain";
import { revalidatePath } from "next/cache";

export async function toggleDownvote(complaintId: string) {
  if (!complaintId) {
    throw new Error("Complaint ID is required");
  }

  const userId = await getUserId();

  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    // Check if the user has already downvoted the complaint
    const existingDownvote = await prisma.complaintDownvote.findUnique({
      where: {
        userId_complaintId: {
          userId,
          complaintId,
        },
      },
    });

    if (existingDownvote) {
      // User has already downvoted; remove the downvote
      await prisma.complaintDownvote.delete({
        where: {
          userId_complaintId: {
            userId,
            complaintId,
          },
        },
      });

      revalidatePath("/dashboard");
      return { success: true, message: "Downvote removed" };
    } else {
      // User has not downvoted; check if they have upvoted
      const existingUpvote = await prisma.complaintUpvote.findUnique({
        where: {
          userId_complaintId: {
            userId,
            complaintId,
          },
        },
      });

      if (existingUpvote) {
        // Remove the upvote if it exists
        await prisma.complaintUpvote.delete({
          where: {
            userId_complaintId: {
              userId,
              complaintId,
            },
          },
        });
      }

      // Add a downvote
      await prisma.complaintDownvote.create({
        data: {
          userId,
          complaintId,
        },
      });

      revalidatePath("/dashboard");
      return { success: true, message: "Downvoted successfully" };
    }
  } catch (error) {
    console.error("Error toggling downvote:", error);
    return false;
  }
}
