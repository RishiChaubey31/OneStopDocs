"use client";
import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Undo2,
  Redo2,
} from "lucide-react";

interface HistoryControlsProps {
  editor: Editor | null;
}

export const HistoryControls = ({ editor }: HistoryControlsProps) => {
  if (!editor) return null;

  return (
    <div className="flex gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Undo (Ctrl+Z)"
        onClick={() => editor.chain().focus().undo().run()}
        className="cursor-pointer"
      >
        <Undo2 className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Redo (Ctrl+Y)"
        onClick={() => editor.chain().focus().redo().run()}
        className="cursor-pointer"
      >
        <Redo2 className="size-4" />
      </Button>
    </div>
  );
}; 