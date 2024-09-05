"use client";

import React from "react";
import { Button } from "./ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { upvoteComplaint } from "@/app/actions/Upvote";
import { toast } from "sonner";
import { toggleDownvote } from "@/app/actions/downvoteComplaint";

const VoteButtons = (complaint: {
  upvotes: number;
  downvotes: number;
  id: string;
}) => {
  return (
    <div className="flex space-x-2 z-50">
      <Button
        onClick={async () => {
          const upvote = await upvoteComplaint(complaint?.id);
          if (upvote) {
            toast.success("Upvoted");
          } else {
            toast.error("You have already upvoted this complaint");
          }
        }}
        variant="outline"
        size="sm"
      >
        <ThumbsUp className="w-4 h-4 mr-1" />
        {complaint.upvotes}
      </Button>
      <Button
        onClick={async () => {
          const downvote = await toggleDownvote(complaint?.id);
          if (downvote) {
            toast.success("Downvoted");
          } else {
            toast.error("You have already downvoted this complaint");
          }
        }}
        variant="outline"
        size="sm"
      >
        <ThumbsDown className="w-4 h-4 mr-1" />
        {complaint.downvotes}
      </Button>
    </div>
  );
};

export default VoteButtons;
