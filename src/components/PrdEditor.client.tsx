"use client";
import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { BackgroundColor } from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import FontSize from "@tiptap/extension-font-size";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { NodeSelection } from '@tiptap/pm/state';

// Custom Image extension with drag and resize functionality
const DraggableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.style.width,
        renderHTML: attributes => {
          if (!attributes.width) {
            return {}
          }
          return {
            style: `width: ${attributes.width}`,
          }
        },
      },
      height: {
        default: null,
        parseHTML: element => element.style.height,
        renderHTML: attributes => {
          if (!attributes.height) {
            return {}
          }
          return {
            style: `height: ${attributes.height}`,
          }
        },
      },
    }
  },
  
  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement('div');
      container.className = 'image-container';
      
      const image = document.createElement('img');
      image.src = node.attrs.src;
      image.alt = node.attrs.alt || '';
      image.className = 'draggable-image';
      
      if (node.attrs.width) {
        image.style.width = node.attrs.width;
      }
      if (node.attrs.height) {
        image.style.height = node.attrs.height;
      }
      
      // Add resize handles
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'resize-handle';
      resizeHandle.innerHTML = '↘';
      
      container.appendChild(image);
      container.appendChild(resizeHandle);
      

      
      // Resize functionality
      let isResizing = false;
      let startWidth: number, startHeight: number, startX: number, startY: number;
      
      resizeHandle.addEventListener('mousedown', (e: MouseEvent) => {
        isResizing = true;
        startWidth = image.offsetWidth;
        startHeight = image.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;
        
        e.preventDefault();
        e.stopPropagation();
        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('mouseup', handleResizeUp);
      });
      
      const handleResizeMove = (e: MouseEvent) => {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        const newWidth = Math.max(50, startWidth + deltaX);
        const newHeight = Math.max(50, startHeight + deltaY);
        
        image.style.width = `${newWidth}px`;
        image.style.height = `${newHeight}px`;
        
        // Update the node attributes
        const pos = getPos();
        if (pos !== undefined) {
          const tr = editor.view.state.tr;
          tr.setNodeAttribute(pos, 'width', `${newWidth}px`);
          tr.setNodeAttribute(pos, 'height', `${newHeight}px`);
          editor.view.dispatch(tr);
        }
      };
      
      const handleResizeUp = () => {
        isResizing = false;
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeUp);
      };
      
      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type !== node.type) {
            return false;
          }
          
          image.src = updatedNode.attrs.src;
          image.alt = updatedNode.attrs.alt || '';
          
          if (updatedNode.attrs.width) {
            image.style.width = updatedNode.attrs.width;
          }
          if (updatedNode.attrs.height) {
            image.style.height = updatedNode.attrs.height;
          }
          
          return true;
        },
      };
    };
  },
});

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

const PAGE_HEIGHT = 1123; // px, matches .tiptap-page min-height
const PAGE_WIDTH = 794; // px, matches .tiptap-page width

export const MenuBar = ({ editor }: { editor: Editor | null }) => {
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

  // Load visible fonts when dropdown opens
  useEffect(() => {
    if (showFontDropdown) {
      fontFamilies.slice(0, 20).forEach((f) => {
        if (f.value) loadGoogleFont(f.value);
      });
    }
  }, [showFontDropdown, fontFamilies]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        fontDropdownRef.current &&
        !fontDropdownRef.current.contains(e.target as Node)
      ) {
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
    <div className="sticky top-4 z-40 flex justify-center bg-violet-200">
      <div className="flex flex-wrap gap-2 p-2 max-w-4xl mx-auto w-full bg-white shadow-lg rounded-xl">
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
              className="border rounded px-2 py-1 text-sm font-medium min-w-[80px] text-left bg-white dark:bg-zinc-900"
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
        {/* Font Family Dropdown using shadcn/ui DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="border rounded px-2 py-1 text-sm font-medium min-w-[180px] text-left bg-white dark:bg-zinc-900"
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
        {/* Existing formatting buttons */}
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

const PrdEditor = forwardRef(function PrdEditor(props: any, ref) {
  const [description, setDescription] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3, 4] }),
      FontFamily.configure({ types: ["textStyle"] }),
      FontSize.configure({ types: ["textStyle"] }),
      TextStyle,
      Color,
      BackgroundColor,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Highlight,
      DraggableImage,
    ],
    content: description,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      getHtml: () => editor?.getHTML() || "",
    }),
    [editor]
  );

  // Call onEditorReady when editor is ready
  useEffect(() => {
    if (editor && props.onEditorReady) {
      props.onEditorReady(editor);
    }
  }, [editor, props.onEditorReady]);

  const editorContentRef = useRef<HTMLDivElement>(null);

  const handlePageClick = () => {
    if (editor) {
      editor.commands.focus();
    }
  };

  // Handle file drops and drag events
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      const file = imageFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result && editor) {
          editor.chain().focus().setImage({ src: result }).run();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // Only set to false if we're leaving the container entirely
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  return (
    <div className="editor-paged-container">
      <div
        className={`tiptap-page relative cursor-text ${isDragOver ? 'drag-over' : ''}`}
        onClick={handlePageClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {/* <link
          href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Oswald:400,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Merriweather:400,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Playfair+Display:400,700&display=swap"
          rel="stylesheet"
        /> */}
        <EditorContent editor={editor} ref={editorContentRef} />
        <style>{`
  .tiptap-page h1 { font-size: 2.75rem; font-weight: bold; margin: 1.5em 0 0.8em; }
  .tiptap-page h2 { font-size: 2.25rem; font-weight: bold; margin: 1.2em 0 0.6em; }
  .tiptap-page h3 { font-size: 1.5rem; font-weight: bold; margin: 1em 0 0.5em; }
  .tiptap-page h4 { font-size: 1.17rem; font-weight: bold; margin: 0.8em 0 0.4em; }
  
  .tiptap-page mark {
    background-color: #fef08a;
    color: #000;
    padding: 0.1em 0.2em;
    border-radius: 0.2em;
  }
  
  .image-container {
    position: relative;
    display: inline-block;
    margin: 1em 0;
  }
  
  .draggable-image {
    cursor: default;
    user-select: none;
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: 4px;
  }
  
  .draggable-image:hover {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  .resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background: #3b82f6;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: nw-resize;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 10;
  }
  
  .image-container:hover .resize-handle {
    opacity: 1;
  }
  
  .resize-handle:hover {
    background: #2563eb;
  }
  
  .tiptap-page.drag-over {
    background-color: rgba(59, 130, 246, 0.1);
    border: 2px dashed #3b82f6;
  }
  
  /* Remove focus outline from editor */
  .tiptap-page .ProseMirror {
    outline: none !important;
  }
  
  .tiptap-page .ProseMirror:focus {
    outline: none !important;
  }
  
  /* Remove any default browser focus styles */
  .tiptap-page *:focus {
    outline: none !important;
  }
`}</style>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-zinc-500 select-none">
          Page 1 / 1
        </div>
      </div>
    </div>
  );
});

export default PrdEditor;
