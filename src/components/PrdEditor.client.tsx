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
import Link from "@tiptap/extension-link";

import { Toolbar } from "./Toolbar";

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





interface PrdEditorProps {
  onEditorReady?: (editor: Editor) => void;
}

const PrdEditor = forwardRef<{ getHtml: () => string }, PrdEditorProps>(function PrdEditor(props, ref) {
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
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'link',
        },
        protocols: ['http', 'https', 'mailto', 'tel'],
      }),
      DraggableImage,
    ],
    content: description,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        // Ctrl+K or Cmd+K to open link dialog
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
          event.preventDefault();
          // This will be handled by the toolbar component
          return true;
        }
        return false;
      },
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
    background-color: #fbbf24;
    color: #000;
    padding: 0.1em 0.2em;
    border-radius: 0.2em;
  }
  
  .tiptap-page .link {
    color: #2563eb;
    text-decoration: underline;
    cursor: pointer;
  }
  
  .tiptap-page .link:hover {
    color: #1d4ed8;
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
