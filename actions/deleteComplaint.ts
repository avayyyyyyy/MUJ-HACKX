"use server"

import prisma from "@/lib/db"

export const deleteComplaint = async (id : string) => {

  const deleteComplain = await prisma.complaint.delete({
    where: {
      id
    }
  })

  return deleteComplain ? true : false;
}