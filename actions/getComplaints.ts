"use server"

import prisma from "@/lib/db"

export const getComplaints = async () => {
  const complaints = await prisma.complaint.findMany({
    orderBy: {
      createdAt: "desc",
    }
  });

  return complaints;
};