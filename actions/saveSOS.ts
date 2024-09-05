"use server";

import prisma from "@/lib/db";

export const saveSOS = async ({id,latitude, longitude}: {id:string, longitude: string,latitude:string }) => {
  try {
    await prisma.sos.create({
      data: {
        id,
        latitude,
        longitude
      }
    });
    console.log(`SOS with ID ${id} saved successfully.`);
  } catch (error) {
    console.error("Error saving SOS:", error);
    throw new Error("Failed to save SOS.");
  }
};
