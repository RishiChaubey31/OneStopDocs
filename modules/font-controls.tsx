"use client";
import React, { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface FontControlsProps {
  editor: Editor | null;
}

export const FontControls = ({ editor }: FontControlsProps) => {
  const [fontFamilies, setFontFamilies] = useState([
    { label: "Default", value: "" },
  ]);
  const [loadingFonts, setLoadingFonts] = useState(true);
  const [currentFont, setCurrentFont] = useState("");
  const [currentFontSize, setCurrentFontSize] = useState("");
  const [currentHeading, setCurrentHeading] = useState("Normal");

  const fontSizes = [
    { label: "12", value: "12px" },
    { label: "14", value: "14px" },
    { label: "16", value: "16px" },
    { label: "18", value: "18px" },
    { label: "20", value: "20px" },
    { label: "24", value: "24px" },
    { label: "28", value: "28px" },
    { label: "32", value: "32px" },
    { label: "36", value: "36px" },
    { label: "40", value: "40px" },
    { label: "48", value: "48px" },
    { label: "56", value: "56px" },
    { label: "64", value: "64px" },
    { label: "72", value: "72px" },
  ];

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
        const res = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`
        );
        const data = await res.json();
        setFontFamilies([
          { label: "Default", value: "" },
          ...data.items.map((font: { family: string }) => ({
            label: font.family,
            value: font.family,
          })),
        ]);
      } catch (e) {
        setFontFamilies([{ label: "Default", value: "" }]);
      } finally {
        setLoadingFonts(false);
      }
    }
    fetchFonts();
  }, []);

  // Update current values when editor changes
  useEffect(() => {
    if (!editor) return;

    const updateCurrentValues = () => {
      // Update heading
      const newHeading = editor.isActive("heading", { level: 1 })
        ? "Title"
        : editor.isActive("heading", { level: 2 })
        ? "Heading 1"
        : editor.isActive("heading", { level: 3 })
        ? "Heading 2"
        : editor.isActive("heading", { level: 4 })
        ? "Heading 3"
        : "Normal";
      setCurrentHeading(newHeading);

      // Update font family
      const attributes = editor.getAttributes('textStyle');
      const newFont = attributes.fontFamily || "";
      setCurrentFont(newFont);

      // Update font size
      const newFontSize = attributes.fontSize || "";
      setCurrentFontSize(newFontSize);
    };

    // Update immediately
    updateCurrentValues();

    // Listen for editor updates
    const handleUpdate = () => {
      updateCurrentValues();
    };

    editor.on('update', handleUpdate);
    editor.on('selectionUpdate', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      editor.off('selectionUpdate', handleUpdate);
    };
  }, [editor]);

  function loadGoogleFont(fontName: string) {
    if (!fontName) return;
    const fontUrl = `https://fonts.googleapis.com/css?family=${fontName.replace(
      / /g,
      "+"
    )}:400,700&display=swap`;
    if (
      ![...document.head.querySelectorAll("link")].some(
        (link) => link.href === fontUrl
      )
    ) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = fontUrl;
      document.head.appendChild(link);
    }
  }

  if (!editor) return null;

  return (
    <div className="flex gap-2">
      {/* Font Size Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm font-medium min-w-[80px] text-left bg-white dark:bg-slate-800 cursor-pointer"
            type="button"
            title="Font Size"
          >
            {currentFontSize
              ? fontSizes.find((f) => f.value === currentFontSize)?.label || currentFontSize.replace('px', '')
              : "16"}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[80px]">
          {fontSizes.map((f) => (
            <DropdownMenuItem
              key={f.value}
              onClick={() =>
                editor.chain().focus().setFontSize(f.value).run()
              }
              className={
                currentFontSize === f.value
                  ? "bg-zinc-200 dark:bg-zinc-700"
                  : ""
              }
            >
              {f.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font Family Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm font-medium min-w-[180px] text-left bg-white dark:bg-slate-800 cursor-pointer"
            type="button"
            title="Font Family"
          >
            {loadingFonts
              ? "Loading fonts..."
              : currentFont
              ? fontFamilies.find((f) => f.value === currentFont)?.label || currentFont
              : "Arial"}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-64 overflow-auto min-w-[180px]">
          {fontFamilies.slice(0, 200).map((f) => (
            <DropdownMenuItem
              key={f.value}
              style={{ fontFamily: f.value || "inherit" }}
              onMouseEnter={() => f.value && loadGoogleFont(f.value)}
              onClick={() => {
                editor.chain().focus().setFontFamily(f.value).run();
                if (f.value) loadGoogleFont(f.value);
              }}
              className={
                currentFont === f.value ? "bg-zinc-200 dark:bg-zinc-700" : ""
              }
            >
              {f.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Heading Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm font-medium min-w-[110px] text-left bg-white dark:bg-slate-800 cursor-pointer"
            type="button"
            title="Heading Level (Ctrl+1-4)"
          >
            {currentHeading}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[110px]">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            Normal
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            Title
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
          >
            Heading 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}; 