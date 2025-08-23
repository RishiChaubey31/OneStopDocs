"use client";
import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  TextFormatting,
  TextAlignment,
  FontControls,
  HistoryControls,
  MediaControls,
  ColorControls,
  KeyboardShortcuts,
} from "../../modules";

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg backdrop-blur-sm w-fit group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-l from-blue-200 via-yellow-200 to-violet-200 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></div>
      <div className="relative z-10 flex flex-wrap gap-2 p-3 justify-center">
        <TextAlignment editor={editor} />
        <FontControls editor={editor} />
        <TextFormatting editor={editor} />
        <HistoryControls editor={editor} />
        <MediaControls editor={editor} />
        <ColorControls editor={editor} />
      </div>
      
      <KeyboardShortcuts editor={editor} />
    </div>
  );
}; 