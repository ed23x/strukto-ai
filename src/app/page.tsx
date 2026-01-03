"use client";

import React, { useState, useRef } from "react";
import { useTheme } from "next-themes";
import { Diagram, DiagramResponse } from "@/types/diagram";
import { DiagramRenderer } from "@/components/DiagramRenderer";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { 
  Moon, 
  Sun, 
  Download, 
  Play, 
  Settings, 
  Loader2, 
  FileCode,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [code, setCode] = useState("// Write your code here...\nfunction example() {\n  if (x > 0) {\n    print('Hello');\n  } else {\n    print('World');\n  }\n}");
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  // Generate Diagrams
  const handleGenerate = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, apiKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }

      if (data.diagrams) {
        setDiagrams(data.diagrams);
        toast.success(`Generated ${data.diagrams.length} diagrams`);
      } else {
        toast.error("Invalid response format");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Export Single
  const exportSingle = async (index: number, title: string) => {
    const node = document.getElementById(`diagram-${index}`);
    if (!node) return;

    try {
      const dataUrl = await toPng(node, { 
        backgroundColor: theme === 'dark' ? '#09090b' : '#fff',
        style: {
          overflow: 'visible',
          height: 'auto',
          width: 'auto',
        }
      });
      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Exported " + title);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export " + title);
    }
  };

  // Export All
  const exportAll = async () => {
    if (diagrams.length === 0) return;
    
    toast.info("Starting bulk export...");
    
    for (let i = 0; i < diagrams.length; i++) {
        await exportSingle(i, diagrams[i].title);
        // Small delay to prevent browser throttling
        await new Promise(r => setTimeout(r, 200));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
           <div className="p-2 bg-primary text-primary-foreground rounded-lg">
             <FileCode size={24} />
           </div>
           <h1 className="text-xl font-bold tracking-tight">Struckto AI</h1>
        </div>

        <div className="flex items-center gap-2">
            <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors"
                title="Settings"
            >
                <Settings size={20} />
            </button>
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors"
                title="Toggle Theme"
            >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
          <div className="p-4 bg-muted border-b animate-in slide-in-from-top-2">
              <div className="max-w-screen-xl mx-auto flex gap-4 items-center">
                  <label className="text-sm font-medium whitespace-nowrap">OpenRouter API Key (Optional if env set):</label>
                  <input 
                    type="password" 
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API Key to override server default"
                    className="flex-1 p-2 rounded border bg-background text-sm"
                  />
              </div>
          </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Editor Pane */}
        <div className="flex-1 flex flex-col border-r p-4 gap-4 h-[50vh] lg:h-auto overflow-y-auto bg-muted/10">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <FileCode size={18} /> Source Code
                </h2>
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                    Generate Diagrams
                </button>
            </div>
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 p-4 font-mono text-sm bg-card border rounded-lg shadow-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                placeholder="Paste your code here..."
            />
        </div>

        {/* Preview Pane */}
        <div className="flex-1 flex flex-col p-4 gap-4 h-[50vh] lg:h-auto overflow-y-auto bg-muted/30">
             <div className="flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-sm">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <ImageIcon size={18} /> Visualizations
                </h2>
                {diagrams.length > 0 && (
                    <button
                        onClick={exportAll}
                        className="text-xs flex items-center gap-1 hover:underline text-muted-foreground"
                    >
                        <Download size={16} />
                        Export All
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-8 pb-10">
                {diagrams.length === 0 && !loading && (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50 min-h-[200px]">
                        <FileCode size={48} className="mb-4" />
                        <p>Generate a diagram to see it here</p>
                    </div>
                )}

                {loading && (
                    <div className="flex-1 flex items-center justify-center min-h-[200px]">
                        <Loader2 className="animate-spin text-primary" size={48} />
                    </div>
                )}

                {diagrams.map((diag, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-md">{diag.title}</h3>
                            <button
                                onClick={() => exportSingle(idx, diag.title)}
                                className="text-xs flex items-center gap-1 hover:underline text-muted-foreground"
                            >
                                <Download size={14} /> PNG
                            </button>
                        </div>
                        <div 
                            id={`diagram-${idx}`}
                            className="bg-white p-8 rounded-lg shadow-md border overflow-x-auto dark:bg-zinc-900"
                        >
                            <DiagramRenderer node={diag.root} isRoot={true} />
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </main>
    </div>
  );
}