"use client";
import PrdEditor from "@/components/PrdEditor.client";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function EditorPage() {
  const router = useRouter();
  const editorRef = useRef<{ getHtml: () => string }>(null);
  const [saveType, setSaveType] = useState<"pdf" | "docx">("pdf");

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      {/* App Bar */}
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}> <ArrowLeft className="size-5" /> </Button>
          <input
            className="text-xl font-bold bg-transparent outline-none border-none px-2 py-1 rounded focus:bg-zinc-100 dark:focus:bg-zinc-900 transition-colors"
            defaultValue="Untitled Document"
            style={{ minWidth: 200 }}
          />
        </div>
        <div className="flex gap-2 items-center">
          <select value={saveType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSaveType(e.target.value as "pdf" | "docx")} className="border rounded px-2 py-1 text-sm">
            <option value="pdf">PDF</option>
            <option value="docx">Word (.docx)</option>
          </select>
          <Button variant="default" size="sm" onClick={handleSave}><Save className="size-4 mr-1" />Save</Button>
        </div>
      </header>
      {/* Editor Area */}
      <main className="flex-1 flex flex-col items-center py-8 px-2 overflow-auto bg-violet-200">
        <div className="w-full max-w-3xl bg-yellow-100 dark:bg-zinc-900 rounded-lg shadow p-0 sm:p-4 border border-zinc-200 dark:border-zinc-800">
          <PrdEditor ref={editorRef} />
        </div>
      </main>
    </div>
  );
} 