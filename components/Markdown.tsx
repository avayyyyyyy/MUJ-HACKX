"use client";
import React from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

const Markdown = ({ report }: { report: string }) => {
  return (
    <div>
      <p>
        <MarkdownPreview source={report} style={{ padding: 16 }} />
      </p>
    </div>
  );
};

export default Markdown;
