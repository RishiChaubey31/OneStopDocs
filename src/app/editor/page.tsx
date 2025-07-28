"use client";
import PrdEditor from "@/components/PrdEditor.client";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Toolbar } from "@/components/Toolbar";
import { Editor } from "@tiptap/react";


export default function EditorPage() {
  const router = useRouter();
  const editorRef = useRef<{ getHtml: () => string }>(null);
  const [saveType, setSaveType] = useState<"pdf" | "docx">("pdf");
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);

  const handleSave = async () => {
    if (!editorRef.current) return;
    const html = editorRef.current.getHtml();
    if (saveType === "pdf") {
      // @ts-expect-error: No types for html2pdf.js
      const html2pdf = (await import("html2pdf.js")).default;
      // Create a hidden div
      const hiddenDiv = document.createElement("div");
      hiddenDiv.style.position = "fixed";
      hiddenDiv.style.left = "-9999px";
      hiddenDiv.style.top = "0";
      hiddenDiv.style.width = "794px";
      hiddenDiv.style.minHeight = "1123px";
      hiddenDiv.style.padding = "48px 40px";
      hiddenDiv.style.background = "#FFFDE7";
      hiddenDiv.innerHTML = html;
      document.body.appendChild(hiddenDiv);
      await html2pdf()
        .from(hiddenDiv)
        .set({ margin: 0, filename: "document.pdf", html2canvas: { scale: 2 }, jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" } })
        .save();
      document.body.removeChild(hiddenDiv);
    } else if (saveType === "docx") {
      // @ts-expect-error: No types for html-docx-js
      const htmlDocx = await import("html-docx-js/dist/html-docx");
      const docx = htmlDocx.asBlob(`<div style='width:794px;min-height:1123px;padding:48px 40px;background:#FFFDE7;'>${html}</div>`);
      const url = URL.createObjectURL(docx);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.docx";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    }
  };

    return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* App Bar */}
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}> <ArrowLeft className="size-5" /> </Button>
          <input
            className="text-xl font-bold bg-transparent outline-none border-none px-2 py-1 rounded focus:bg-slate-100 dark:focus:bg-slate-800 transition-colors"
            defaultValue="Untitled Document"
            style={{ minWidth: 200 }}
          />
        </div>
        <div className="flex gap-2 items-center">
          <select value={saveType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSaveType(e.target.value as "pdf" | "docx")} className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm bg-white dark:bg-slate-800">
            <option value="pdf">PDF</option>
            <option value="docx">Word (.docx)</option>
          </select>
          <Button variant="default" size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"><Save className="size-4 mr-1" />Save</Button>
        </div>
      </header>
      {/* Sticky Toolbar below navbar */}
      <div className="sticky top-[64px] z-40 flex justify-center w-full py-2">
        <Toolbar editor={editorInstance} />
      </div>
      {/* Editor Area */}
      <main className="flex-1 flex flex-col items-center py-8 px-2 overflow-auto relative">
        <div className="relative z-10 w-full max-w-4xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
          <PrdEditor ref={editorRef} onEditorReady={setEditorInstance} />
        </div>
      </main>
    </div>
  );
} 