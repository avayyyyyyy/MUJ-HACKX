"use client";

import { deleteComplaint } from "@/app/actions/deleteComplaint";
import React from "react";
import { Button } from "./ui/button";

const DeleteComplaintButton = ({ id }: { id: string }) => {
  console.log("id: ", id);

  return (
    <div>
      <Button
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={() => deleteComplaint(id)}
      >
        Delete
      </Button>
    </div>
  );
};

export default DeleteComplaintButton;
