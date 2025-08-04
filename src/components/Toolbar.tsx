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
  Link as LinkIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LinkDialog } from "./LinkDialog";

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  const [color, setColor] = React.useState("#000000");
  const [bgColor, setBgColor] = React.useState("#ffffff");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = React.useState(false);
  const [linkDialogData, setLinkDialogData] = React.useState({ url: "", text: "" });
  const [fontFamilies, setFontFamilies] = React.useState([
    { label: "Default", value: "" },
  ]);
  const [loadingFonts, setLoadingFonts] = React.useState(true);
  const [currentFont, setCurrentFont] = React.useState("");
  const [currentFontSize, setCurrentFontSize] = React.useState("");
  const [currentHeading, setCurrentHeading] = React.useState("Normal");
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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        handleLinkClick();
      }
      // Text alignment shortcuts
      if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
        switch (event.key.toLowerCase()) {
          case 'l':
            event.preventDefault();
            editor?.chain().focus().setTextAlign("left").run();
            break;
          case 'e':
            event.preventDefault();
            editor?.chain().focus().setTextAlign("center").run();
            break;
          case 'r':
            event.preventDefault();
            editor?.chain().focus().setTextAlign("right").run();
            break;
        }
      }
      
      // Heading shortcuts (Ctrl+1-4)
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey) {
        const key = event.key;
        if (key >= '1' && key <= '4') {
          event.preventDefault();
          const level = parseInt(key) as 1 | 2 | 3 | 4;
          editor?.chain().focus().toggleHeading({ level }).run();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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



  if (!editor) {
    return null;
  }

    return (
    <div className="bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg backdrop-blur-sm w-fit group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-l from-blue-200 via-yellow-200 to-violet-200 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></div>
      <div className="relative z-10 flex flex-wrap gap-2 p-3 justify-center">
        {/* Text Alignment Buttons */}
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"
          }
          size="icon"
          title="Align Left (Ctrl+Shift+L)"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="cursor-pointer"
        >
          <AlignLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"
          }
          size="icon"
          title="Align Center (Ctrl+Shift+E)"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="cursor-pointer"
        >
          <AlignCenter className="size-4" />
        </Button>
        <Button
          type="button"
          variant={
            editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"
          }
          size="icon"
          title="Align Right (Ctrl+Shift+R)"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="cursor-pointer"
        >
          <AlignRight className="size-4" />
        </Button>

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

        {/* Text Formatting Buttons */}
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

        {/* History Buttons */}
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

        {/* Color Pickers */}
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
      
      <LinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onSave={handleLinkSave}
        initialUrl={linkDialogData.url}
        initialText={linkDialogData.text}
      />
    </div>
  );
}; 