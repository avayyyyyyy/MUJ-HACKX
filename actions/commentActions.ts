"use server";

import prisma from "@/lib/db";

export async function doComment(complaintId: string, content: string, userId: string) {
  console.log(`doComment called with complaintId: ${complaintId}, content: ${content}, userId: ${userId}`);
  
  if (!userId) {
    console.error("User ID is required");
    throw new Error("User ID is required");
  }

  if (!complaintId || !content) {
    console.error("Complaint ID and content are required");
    throw new Error("Complaint ID and content are required");
  }

  console.log("Creating comment with:", { complaintId, content });

  try {
    const comment = await prisma.comment.create({
      data: {
        userId,
        complaintId,
        content,
      },
    });

    console.log("Comment created successfully:", comment);
    return true;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Failed to create comment");
  }
}

export async function getComments(complaintId: string) {
  console.log(`getComments called with complaintId: ${complaintId}`);
  
  if (!complaintId) {
    console.error("Complaint ID is required");
    throw new Error("Complaint ID is required");
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        complaintId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    console.log("Comments retrieved successfully:", comments);
    return comments;
  } catch (error) {
    console.error("Error retrieving comments:", error);
    throw new Error("Failed to retrieve comments");
  }
}
