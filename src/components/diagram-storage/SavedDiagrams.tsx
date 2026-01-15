"use client";
import { useState, useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { supabase, UserDiagram } from "@/lib/supabase";
import { Save, FolderOpen, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SavedDiagramsProps {
  onLoadDiagram: (code: string, diagrams: any[]) => void;
  currentCode: string;
  currentDiagrams: any[];
}

export function SavedDiagrams({ onLoadDiagram, currentCode, currentDiagrams }: SavedDiagramsProps) {
  const user = useUser();
  const [savedDiagrams, setSavedDiagrams] = useState<UserDiagram[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newDiagramCount, setNewDiagramCount] = useState(0);

  // Auto-refresh when user signs in
  useEffect(() => {
    if (user) {
      loadSavedDiagrams();
    }
  }, [user]);

  const loadSavedDiagrams = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/diagrams");
      const { diagrams } = await response.json();
      setSavedDiagrams(diagrams || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load diagrams");
    } finally {
      setLoading(false);
    }
  };

  const saveDiagram = async () => {
    if (!currentCode.trim() || currentDiagrams.length === 0) {
      toast.error("Please generate diagrams first");
      return;
    }

    setSaving(true);
    try {
      const title = prompt("Enter a title for your diagram:");
      if (!title) return;

      const response = await fetch("/api/diagrams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          sourceCode: currentCode,
          diagramData: currentDiagrams,
        }),
      });

      const { diagram } = await response.json();
      if (!response.ok) {
        throw new Error(diagram.error || "Failed to save diagram");
      }

      toast.success("Diagram saved successfully!");
      loadSavedDiagrams();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const loadDiagram = (diagram: UserDiagram) => {
    onLoadDiagram(diagram.source_code, diagram.diagram_data);
    toast.success("Diagram loaded successfully!");
  };

  const deleteDiagram = async (id: string) => {
    if (!confirm("Are you sure you want to delete this diagram?")) return;

    try {
      const response = await fetch(`/api/diagrams/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete diagram");
      }

      toast.success("Diagram deleted successfully!");
      loadSavedDiagrams();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FolderOpen size={18} />
            Saved Diagrams
            {newDiagramCount > 0 && (
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full animate-pulse">
                +{newDiagramCount}
              </span>
            )}
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : savedDiagrams.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p>No saved diagrams yet</p>
            <p className="text-sm">Generate a diagram and save it to see it here</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {savedDiagrams.map((diagram) => (
              <div
                key={diagram.id}
                className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => loadDiagram(diagram)}
                >
                  <h4 className="font-medium text-sm">{diagram.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {new Date(diagram.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteDiagram(diagram.id)}
                  className="p-1 hover:bg-destructive hover:text-destructive-foreground rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}