"use client";
import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { BackgroundColor } from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";

import { Button } from "@/components/ui/button";
import { Bold, Italic, Undo2, Redo2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const PAGE_HEIGHT = 1123; // px, matches .tiptap-page min-height
const PAGE_WIDTH = 794; // px, matches .tiptap-page width

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [color, setColor] = React.useState("#000000");
  const [bgColor, setBgColor] = React.useState("#ffffff");
  const [fontFamilies, setFontFamilies] = React.useState([
    { label: "Default", value: "" }
  ]);
  const [loadingFonts, setLoadingFonts] = React.useState(true);
  const [showFontDropdown, setShowFontDropdown] = React.useState(false);
  const fontDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchFonts() {
      setLoadingFonts(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        if (!apiKey) {
          setFontFamilies([{ label: "API key missing", value: "" }]);
          setLoadingFonts(false);
          return;
        }
        const res = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`);
        const data = await res.json();
        setFontFamilies([
          { label: "Default", value: "" },
          ...data.items.map((font: { family: string }) => ({ label: font.family, value: font.family }))
        ]);
      } catch (e) {
        setFontFamilies([{ label: "Default", value: "" }]);
      } finally {
        setLoadingFonts(false);
      }
    }
    fetchFonts();
  }, []);

  function loadGoogleFont(fontName: string) {
    if (!fontName) return;
    const fontUrl = `https://fonts.googleapis.com/css?family=${fontName.replace(/ /g, '+')}:400,700&display=swap`;
    if (![...document.head.querySelectorAll('link')].some(link => link.href === fontUrl)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontUrl;
      document.head.appendChild(link);
    }
  }

  // Load visible fonts when dropdown opens
  useEffect(() => {
    if (showFontDropdown) {
      fontFamilies.slice(0, 20).forEach(f => {
        if (f.value) loadGoogleFont(f.value);
      });
    }
  }, [showFontDropdown, fontFamilies]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(e.target as Node)) {
        setShowFontDropdown(false);
      }
    }
    if (showFontDropdown) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showFontDropdown]);

  if (!editor) {
    return null;
  }
  // Dropdown for heading/paragraph selection
  const currentHeading =
    editor.isActive("heading", { level: 1 }) ? "Title" :
    editor.isActive("heading", { level: 2 }) ? "Heading 1" :
    editor.isActive("heading", { level: 3 }) ? "Heading 2" :
    editor.isActive("heading", { level: 4 }) ? "Heading 3" :
    "Normal";
  // Get current font family from selection
  const currentFont = fontFamilies.find(f => editor.isActive("textStyle", { fontFamily: f.value }))?.value || "";

  return (
    <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800 p-2 bg-zinc-50 dark:bg-zinc-900 rounded-t-md">
      {/* Text Alignment Buttons */}
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
        size="icon"
        title="Align Left"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
        size="icon"
        title="Align Center"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="size-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
        size="icon"
        title="Align Right"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="size-4" />
      </Button>
      {/* Font Family Dropdown using shadcn/ui DropdownMenu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="border rounded px-2 py-1 text-sm font-medium min-w-[180px] text-left bg-white dark:bg-zinc-900"
            type="button"
          >
            {loadingFonts ? "Loading fonts..." : (fontFamilies.find(f => f.value === currentFont)?.label || "Default")}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-64 overflow-auto min-w-[180px]">
          {fontFamilies.slice(0, 200).map(f => (
            <DropdownMenuItem
              key={f.value}
              style={{ fontFamily: f.value || 'inherit' }}
              onMouseEnter={() => f.value && loadGoogleFont(f.value)}
              onClick={() => {
                editor.chain().focus().setFontFamily(f.value).run();
                if (f.value) loadGoogleFont(f.value);
              }}
              className={currentFont === f.value ? "bg-zinc-200 dark:bg-zinc-700" : ""}
            >
              {f.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Heading Dropdown using shadcn/ui DropdownMenu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="border rounded px-2 py-1 text-sm font-medium min-w-[110px] text-left bg-white dark:bg-zinc-900"
            type="button"
            title="Heading Level"
          >
            {currentHeading}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[110px]">
          <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
            Normal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            Title
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
            Heading 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Existing formatting buttons */}
      <Button type="button" variant={editor.isActive("bold") ? "secondary" : "ghost"} size="icon" onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="size-4" /></Button>
      <Button type="button" variant={editor.isActive("italic") ? "secondary" : "ghost"} size="icon" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="size-4" /></Button>
      <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().undo().run()}><Undo2 className="size-4" /></Button>
      <Button type="button" variant="ghost" size="icon" onClick={() => editor.chain().focus().redo().run()}><Redo2 className="size-4" /></Button>
      <input
        type="color"
        value={color}
        onChange={e => {
          setColor(e.target.value);
          editor.commands.setColor(e.target.value);
        }}
        title="Text color"
        className="w-8 h-8 p-0 border rounded cursor-pointer"
        style={{ background: "none" }}
      />
      <input
        type="color"
        value={bgColor}
        onChange={e => {
          setBgColor(e.target.value);
          editor.chain().focus().setBackgroundColor(e.target.value).run();
        }}
        title="Text background"
        className="w-8 h-8 p-0 border rounded cursor-pointer"
        style={{ background: "none" }}
      />
    </div>
  );
};

const PrdEditor = forwardRef(function PrdEditor(_, ref) {
  const [description, setDescription] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3, 4] }),
      FontFamily.configure({ types: ["textStyle"] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      BackgroundColor,
    ],
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
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Oswald:400,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather:400,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,700&display=swap" rel="stylesheet" />
        <EditorContent editor={editor} ref={editorContentRef} />
        <style>{`
  .tiptap-page h1 { font-size: 2.75rem; font-weight: bold; margin: 1.5em 0 0.8em; }
  .tiptap-page h2 { font-size: 2.25rem; font-weight: bold; margin: 1.2em 0 0.6em; }
  .tiptap-page h3 { font-size: 1.5rem; font-weight: bold; margin: 1em 0 0.5em; }
  .tiptap-page h4 { font-size: 1.17rem; font-weight: bold; margin: 0.8em 0 0.4em; }
`}</style>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-zinc-500 select-none">
          Page 1 / 1
        </div>
      </div>
    </div>
  );
});

export default PrdEditor; 