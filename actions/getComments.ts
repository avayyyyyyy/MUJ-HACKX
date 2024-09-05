"use server";

import prisma from "@/lib/db";

export const getComments = async (complaintId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      complaintId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });

  return comments;
};