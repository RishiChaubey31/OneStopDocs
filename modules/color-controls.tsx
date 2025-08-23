"use client";
import React, { useState } from "react";
import { Editor } from "@tiptap/react";

interface ColorControlsProps {
  editor: Editor | null;
}

export const ColorControls = ({ editor }: ColorControlsProps) => {
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  if (!editor) return null;

  return (
    <div className="flex gap-1">
      {/* Text Color Picker */}
      <input
        type="color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          editor.commands.setColor(e.target.value);
        }}
        title="Text Color"
        className="w-8 h-8 p-0 border rounded cursor-pointer"
        style={{ background: "none" }}
      />
      
      {/* Background Color Picker */}
      <input
        type="color"
        value={bgColor}
        onChange={(e) => {
          setBgColor(e.target.value);
          editor.chain().focus().setBackgroundColor(e.target.value).run();
        }}
        title="Background Color"
        className="w-8 h-8 p-0 border rounded cursor-pointer"
        style={{ background: "none" }}
      />
    </div>
  );
}; 