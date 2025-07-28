"use client";
import React, { useEffect } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  const [color, setColor] = React.useState("#000000");
  const [bgColor, setBgColor] = React.useState("#ffffff");
  const [fontFamilies, setFontFamilies] = React.useState([
    { label: "Default", value: "" },
  ]);
  const [loadingFonts, setLoadingFonts] = React.useState(true);
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



  if (!editor) {
    return null;
  }

  // Dropdown for heading/paragraph selection
  const currentHeading = editor.isActive("heading", { level: 1 })
    ? "Title"
    : editor.isActive("heading", { level: 2 })
    ? "Heading 1"
    : editor.isActive("heading", { level: 3 })
    ? "Heading 2"
    : editor.isActive("heading", { level: 4 })
    ? "Heading 3"
    : "Normal";

  // Get current font family from selection
  const currentFont =
    fontFamilies.find((f) =>
      editor.isActive("textStyle", { fontFamily: f.value })
    )?.value || "";

  // Get current font size from selection
  const currentFontSize =
    fontSizes.find((f) => editor.isActive("textStyle", { fontSize: f.value }))
      ?.value || "";

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg backdrop-blur-sm w-fit">
      <div className="flex flex-wrap gap-2 p-3 justify-center">
        {/* Text Alignment Buttons */}
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"
          }
          size="icon"
          title="Align Left"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"
          }
          size="icon"
          title="Align Center"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="size-4" />
        </Button>
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"
          }
          size="icon"
          title="Align Right"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="size-4" />
        </Button>

        {/* Font Size Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
                         <button
               className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm font-medium min-w-[80px] text-left bg-white dark:bg-slate-800"
               type="button"
             >
              {currentFontSize
                ? fontSizes.find((f) => f.value === currentFontSize)?.label
                : "Size"}
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
               className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm font-medium min-w-[180px] text-left bg-white dark:bg-slate-800"
               type="button"
             >
              {loadingFonts
                ? "Loading fonts..."
                : fontFamilies.find((f) => f.value === currentFont)?.label ||
                  "Default"}
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
               className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm font-medium min-w-[110px] text-left bg-white dark:bg-slate-800"
               type="button"
               title="Heading Level"
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

        {/* Text Formatting Buttons */}
        <Button
          type="button"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("underline") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("highlight") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="size-4" />
        </Button>

        {/* History Buttons */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="size-4" />
        </Button>

        {/* Image Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
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
        >
          <ImageIcon className="size-4" />
        </Button>

        {/* Color Pickers */}
        <input
          type="color"
          value={color}
          onChange={(e) => {
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
          onChange={(e) => {
            setBgColor(e.target.value);
            editor.chain().focus().setBackgroundColor(e.target.value).run();
          }}
          title="Text background"
          className="w-8 h-8 p-0 border rounded cursor-pointer"
          style={{ background: "none" }}
        />
      </div>
    </div>
  );
}; 