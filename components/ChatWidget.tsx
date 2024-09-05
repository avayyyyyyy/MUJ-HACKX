"use client";

import React, { useState, useEffect } from "react";
import { doComment, getComments } from "@/app/actions/commentActions";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: Date; // Added createdAt for time calculations
  user: User;
}

const ChatWidget: React.FC<{ id: string; userId: string }> = ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  if (!id) {
    throw new Error("Complaint ID is required");
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    async function fetchComments() {
      try {
        const fetchedComments = await getComments(id);
        setMessages(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }

    fetchComments();
  }, [id]);

  const handleSend = async () => {
    if (input.trim()) {
      try {
        const comment = await doComment(id, input, userId);
        if (comment) {
          setInput("");
          const updatedComments = await getComments(id);
          setMessages(updatedComments);
        }
      } catch (error) {
        console.error("Error sending comment:", error);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 z-[1000] max-w-xs bg-zinc-900 shadow-md border border-zinc-800 rounded-lg overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4 overflow-y-auto bg-zinc-800">
          {messages.length === 0 ? (
            <div className="text-center text-zinc-400">No messages yet</div>
          ) : (
            messages.map((msg: Message) => (
              <div
                key={msg.id}
                className="mb-3 flex items-start p-3 bg-zinc-700 rounded-lg shadow-sm"
              >
                <Avatar>
                  <AvatarImage
                    src={
                      msg?.user?.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${msg?.user?.name
                        .charAt(0)
                        .toUpperCase()}&background=random`
                    }
                    alt={msg?.user?.name}
                    className="border border-zinc-600"
                  />
                  <AvatarFallback>
                    {msg?.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex flex-col">
                  <div className="font-bold text-white">{msg?.user?.name}</div>
                  <div className="text-zinc-300">{msg?.content}</div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {dayjs(msg.createdAt).fromNow()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-2 bg-zinc-800 border-t border-zinc-700">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-zinc-600 text-white bg-zinc-700 rounded-lg p-2"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white rounded-lg px-4 py-2"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
