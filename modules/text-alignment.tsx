"use client";
import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface TextAlignmentProps {
  editor: Editor | null;
}

export const TextAlignment = ({ editor }: TextAlignmentProps) => {
  if (!editor) return null;

  return (
    <div className="flex gap-1">
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"
        }
        size="icon"
        title="Align Left (Ctrl+Shift+L)"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className="cursor-pointer"
      >
        <AlignLeft className="size-4" />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"
        }
        size="icon"
        title="Align Center (Ctrl+Shift+E)"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className="cursor-pointer"
      >
        <AlignCenter className="size-4" />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"
        }
        size="icon"
        title="Align Right (Ctrl+Shift+R)"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className="cursor-pointer"
      >
        <AlignRight className="size-4" />
      </Button>
    </div>
  );
}; 