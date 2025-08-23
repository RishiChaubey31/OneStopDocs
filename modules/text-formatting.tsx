"use client";
import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
} from "lucide-react";

interface TextFormattingProps {
  editor: Editor | null;
}

export const TextFormatting = ({ editor }: TextFormattingProps) => {
  if (!editor) return null;

  return (
    <div className="flex gap-1">
      <Button
        type="button"
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
        size="icon"
        title="Bold (Ctrl+B)"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="cursor-pointer"
      >
        <Bold className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
        size="icon"
        title="Italic (Ctrl+I)"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="cursor-pointer"
      >
        <Italic className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("underline") ? "secondary" : "ghost"}
        size="icon"
        title="Underline (Ctrl+U)"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="cursor-pointer"
      >
        <UnderlineIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("strike") ? "secondary" : "ghost"}
        size="icon"
        title="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className="cursor-pointer"
      >
        <Strikethrough className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("highlight") ? "secondary" : "ghost"}
        size="icon"
        title="Highlight"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className="cursor-pointer"
      >
        <Highlighter className="size-4" />
      </Button>
    </div>
  );
}; 