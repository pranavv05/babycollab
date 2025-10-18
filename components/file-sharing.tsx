"use client";

import { useState, useEffect } from "react";
import { Paperclip, Download, X } from "lucide-react";

interface SharedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export function FileSharing({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch real files from API
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectId}/files`, { 
          credentials: 'include' 
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch files');
        }
        
        const data = await res.json();
        setFiles(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch files:", error);
        setLoading(false);
      }
    };

    if (projectId) {
      fetchFiles();
    }
  }, [projectId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      try {
        // In a real implementation, you would upload the file to storage and get a URL
        // For now, we'll just create a file entry with a placeholder URL
        const res = await fetch(`/api/projects/${projectId}/files`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: file.name,
            url: '#', // Placeholder URL
            size: file.size,
            type: file.type.split("/")[1]?.toUpperCase() || "FILE",
          })
        });
        
        if (!res.ok) {
          throw new Error('Failed to upload file');
        }
        
        const newFile = await res.json();
        setFiles([newFile, ...files]);
        setIsUploading(false);
      } catch (error) {
        console.error("Failed to upload file:", error);
        alert("Failed to upload file. Please try again.");
        setIsUploading(false);
      }
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/files/${fileId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete file');
      }
      
      setFiles(files.filter(file => file.id !== fileId));
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert("Failed to delete file. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Shared Files</h3>
          <div className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Paperclip className="w-4 h-4" />
            Upload
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-secondary rounded-lg p-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
          <div className="bg-secondary rounded-lg p-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Shared Files</h3>
        <div className="relative">
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className={`bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <Paperclip className="w-4 h-4" />
                Upload
              </>
            )}
          </label>
        </div>
      </div>
      
      <div className="space-y-3">
        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Paperclip className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No files shared yet</p>
            <p className="text-sm mt-1">Upload a file to get started</p>
          </div>
        ) : (
          files.map((file) => (
            <div key={file.id} className="bg-secondary rounded-lg p-3 group relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-medium">
                  {file.type}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>Uploaded by {file.uploadedBy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={file.url} 
                    className="w-8 h-8 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success hover:bg-success/20 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="w-8 h-8 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}