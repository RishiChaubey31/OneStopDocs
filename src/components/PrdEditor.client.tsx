"use client";
import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Undo2, Redo2 } from "lucide-react";

const PAGE_HEIGHT = 1123; // px, matches .tiptap-page min-height
const PAGE_WIDTH = 794; // px, matches .tiptap-page width

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800 p-2 bg-zinc-50 dark:bg-zinc-900 rounded-t-md">
      <Button type="button" variant={editor.isActive("bold") ? "secondary" : "ghost"} size="icon" onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="size-4" /></Button>
      <Button type="button" variant={editor.isActive("italic") ? "secondary" : "ghost"} size="icon" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="size-4" /></Button>
      <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().undo().run()}><Undo2 className="size-4" /></Button>
      <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().redo().run()}><Redo2 className="size-4" /></Button>
    </div>
  );
};

const PrdEditor = forwardRef(function PrdEditor(_, ref) {
  const [description, setDescription] = useState("");
  const editor = useEditor({
    extensions: [StarterKit],
    content: description,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  useImperativeHandle(ref, () => ({
    getHtml: () => editor?.getHTML() || "",
  }), [editor]);

  const editorContentRef = useRef<HTMLDivElement>(null);

  const handlePageClick = () => {
    if (editor) {
      editor.commands.focus();
    }
  };

  return (
    <div className="editor-paged-container">
      <MenuBar editor={editor} />
      <div className="tiptap-page relative cursor-text" onClick={handlePageClick}>
        <EditorContent editor={editor} ref={editorContentRef} />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-zinc-500 select-none">
          Page 1 / 1
        </div>
      </div>
    </div>
  );
});

export default PrdEditor; 