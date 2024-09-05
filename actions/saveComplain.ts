"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getUserId() {
  console.log("Fetching authenticated user...");
  const user = await auth();
  console.log("Authenticated user:", user);

  if (!user || !user.user?.email) {
    console.log("User or user email not found. Aborting...");
    return null;
  }

  console.log(`Looking for user with email: ${user.user.email}`);
  
  const userId = await prisma.user.findUnique({
    where: {
      email: user?.user?.email ?? "",
    },
    select: {
      id: true,
    },
  });

  if (!userId) {
    console.log("User not found in the database.");
  } else {
    console.log(`User found with ID: ${userId.id}`);
  }

  return userId?.id;
}

export const saveComplain = async (data: {
  description: string;
  proof: string;
  latitude: string;
  longitude: string;
  report?: string;
  location: string;
  imageDate: string;
}) => {
  console.log("Starting the process to save a complaint...");
  console.log("Complaint Data:", data);

  // Fetch user ID
  const userId = await getUserId();
  console.log("Fetched User ID:", userId);

  if (!userId) {
    console.error("Error: User not found. Unable to save the complaint.");
    throw new Error("User not found");
  }

  // Proceed to save complaint
  try {
    console.log("Attempting to save complaint in the database...");
    const complaint = await prisma.complaint.create({
      data: {
        description: data.description,
        proof: data.proof,
        location: data.location,
        imageLatitude: data.latitude,
        imageLongitude: data.longitude,
        imageDate: new Date(data.imageDate),
        userId: userId,
        report:data.report
      },
    });

    if (complaint) {
      console.log("Complaint saved successfully:", complaint);
      return true;
    } else {
      console.log("Complaint creation returned null/undefined.");
      return false;
    }
  } catch (error) {
    console.error("Error saving complaint:", error);
    return false;
  }
};
