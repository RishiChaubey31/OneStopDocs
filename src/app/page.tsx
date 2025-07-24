"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PenSquare, FileText, PanelLeft, Shapes, ArrowRight } from "lucide-react";
import PrdEditor from "@/components/PrdEditor.client";

export default function Home() {
  const router = useRouter();
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 flex flex-col">
      {/* Hero Section */}
      <header className="w-full py-16 flex flex-col items-center justify-center text-center gap-6">
        <div className="flex items-center gap-3">
          <Avatar>
           
           
          </Avatar>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
            PRD Creator
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight max-w-2xl bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
          All-in-One Platform for PRDs, Design Docs, Flowcharts & UML Diagrams
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto text-lg sm:text-xl">
          Effortlessly create, collaborate, and share product requirement documents, design docs, flowcharts, and UML diagrams—all in one place.
        </p>
        <Button size="lg" className="mt-4 px-8 py-6 text-lg font-semibold flex items-center gap-2" onClick={() => router.push("/editor")}>Create New Document</Button>
      </header>

      {/* Features Section */}
      <main className="flex-1 w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-col items-center">
            <PenSquare className="size-10 text-primary mb-2" />
            <CardTitle>PRD Editor</CardTitle>
            <CardDescription>Rich, collaborative product requirement docs with versioning and comments.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-col items-center">
            <FileText className="size-10 text-primary mb-2" />
            <CardTitle>Design Docs</CardTitle>
            <CardDescription>Structure and document your designs with clarity and best practices.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-col items-center">
            <PanelLeft className="size-10 text-primary mb-2" />
            <CardTitle>Flowcharts</CardTitle>
            <CardDescription>Visualize processes and logic with an intuitive drag-and-drop flowchart builder.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-col items-center">
            <Shapes className="size-10 text-primary mb-2" />
            <CardTitle>UML Diagrams</CardTitle>
            <CardDescription>Create professional UML diagrams to model your systems and architecture.</CardDescription>
          </CardHeader>
        </Card>
      </main>

      {/* Call to Action Footer */}
      <footer className="w-full py-10 flex flex-col items-center gap-4 border-t border-zinc-200 dark:border-zinc-800 mt-8">
        <span className="text-zinc-500 dark:text-zinc-400 text-sm">© {new Date().getFullYear()} PRD Creator. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="text-zinc-600 hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="text-zinc-600 hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
