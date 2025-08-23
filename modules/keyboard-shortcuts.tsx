"use client";
import React, { useEffect } from "react";
import { Editor } from "@tiptap/react";

interface KeyboardShortcutsProps {
  editor: Editor | null;
  onLinkClick?: () => void;
}

export const KeyboardShortcuts = ({ editor, onLinkClick }: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!editor) return;

      // Link shortcut (Ctrl+K)
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        onLinkClick?.();
      }
      
      // Text alignment shortcuts
      if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
        switch (event.key.toLowerCase()) {
          case 'l':
            event.preventDefault();
            editor.chain().focus().setTextAlign("left").run();
            break;
          case 'e':
            event.preventDefault();
            editor.chain().focus().setTextAlign("center").run();
            break;
          case 'r':
            event.preventDefault();
            editor.chain().focus().setTextAlign("right").run();
            break;
        }
      }
      
      // Heading shortcuts (Ctrl+1-4)
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey) {
        const key = event.key;
        if (key >= '1' && key <= '4') {
          event.preventDefault();
          const level = parseInt(key) as 1 | 2 | 3 | 4;
          editor.chain().focus().toggleHeading({ level }).run();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor, onLinkClick]);

  return null; // This component doesn't render anything
}; 