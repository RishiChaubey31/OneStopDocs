"use client";
import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { LinkDialog } from "@/components/LinkDialog";

interface MediaControlsProps {
  editor: Editor | null;
}

export const MediaControls = ({ editor }: MediaControlsProps) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkDialogData, setLinkDialogData] = useState({ url: "", text: "" });

  const handleLinkClick = () => {
    if (editor) {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);
      const linkAttributes = editor.getAttributes('link');
      
      // If we're on a link, get the link text
      let linkText = text;
      if (editor.isActive('link')) {
        const linkMark = editor.state.schema.marks.link;
        const linkRange = editor.state.selection.$from.marks().find(mark => mark.type === linkMark);
        if (linkRange) {
          // Get the text within the link mark
          const linkFrom = editor.state.selection.from;
          const linkTo = editor.state.selection.to;
          linkText = editor.state.doc.textBetween(linkFrom, linkTo);
        }
      }
      
      setLinkDialogData({
        url: linkAttributes.href || "",
        text: linkText || ""
      });
      setIsLinkDialogOpen(true);
    }
  };

  const handleLinkSave = (url: string, text: string) => {
    if (!editor) return;

    if (!url.trim()) {
      // Remove link
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    if (editor.isActive('link')) {
      // Update existing link
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } else if (text.trim() && !selectedText.trim()) {
      // Insert new text with link
      editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
    } else if (selectedText.trim()) {
      // Apply link to selected text
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      // No selection and no text provided, insert a placeholder link
      editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
    }
  };

  if (!editor) return null;

  return (
    <>
      <div className="flex gap-1">
        {/* Image Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Insert Image"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file && editor) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const result = e.target?.result as string;
                  if (result) {
                    editor.chain().focus().setImage({ src: result }).run();
                  }
                };
                reader.readAsDataURL(file);
              }
            };
            input.click();
          }}
          className="cursor-pointer"
        >
          <ImageIcon className="size-4" />
        </Button>

        {/* Link Button */}
        <Button
          type="button"
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          size="icon"
          onClick={handleLinkClick}
          title="Insert Link (Ctrl+K)"
          className="cursor-pointer"
        >
          <LinkIcon className="size-4" />
        </Button>
      </div>
      
      <LinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onSave={handleLinkSave}
        initialUrl={linkDialogData.url}
        initialText={linkDialogData.text}
      />
    </>
  );
}; 