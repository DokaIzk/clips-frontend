"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, Link as LinkIcon, AlertCircle, CheckCircle2, X } from "lucide-react";

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
const SUPPORTED_PLATFORMS = ["youtube.com", "youtu.be", "tiktok.com", "instagram.com"];

export default function FileUploadForm() {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [interrupted, setInterrupted] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateUrl = (value: string) => {
    if (!value) return true;
    const isSupported = SUPPORTED_PLATFORMS.some((platform) => value.toLowerCase().includes(platform));
    if (!isSupported) {
      setError("URL not supported. Please use YouTube, TikTok, or Instagram.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setSuccess(false);
    validateUrl(value);
  };

  const handleFileChange = (selectedFile: File) => {
    setError(null);
    setSuccess(false);
    setInterrupted(false);

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File exceeds the 2GB limit. Please upload a smaller file.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    // Simulate some logic
    if (Math.random() < 0.3) {
      // Randomly simulate interruption for demonstration
      setTimeout(() => setInterrupted(true), 1500);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (error) return;
    if (!url && !file) {
      setError("Please provide a link or upload a file.");
      return;
    }
    setSuccess(true);
    console.log("Submitting:", { url, file });
  };

  const resetForm = () => {
    setUrl("");
    setFile(null);
    setError(null);
    setInterrupted(false);
    setSuccess(false);
  };

  return (
    <div className="bento-card bento-item-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xl transition-all duration-300">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Upload Content</h2>
          {success && (
            <div className="flex items-center gap-2 text-green-500 text-sm font-medium animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 size={16} />
              <span>Ready to process</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Link Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <LinkIcon size={14} />
              Paste Video Link
            </label>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full h-12 px-4 rounded-xl border ${
                  error && url ? "border-red-500 bg-red-50/10" : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              />
            </div>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500">Or</span>
            </div>
          </div>

          {/* Drag & Drop Section */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative group h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
              isDragging
                ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
            } ${interrupted ? "border-orange-500 bg-orange-500/5 shadow-[0_0_20px_rgba(249,115,22,0.1)]" : ""}`}
          >
            {interrupted ? (
              <div className="text-center animate-in zoom-in duration-300">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500 mb-2">
                  <AlertCircle size={24} className="animate-pulse" />
                </div>
                <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400">Upload Interrupted</h3>
                <p className="text-xs text-zinc-500 mt-1">Check your connection and try again</p>
                <button
                  type="button"
                  onClick={() => setInterrupted(false)}
                  className="mt-3 text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
                >
                  Retry Upload
                </button>
              </div>
            ) : file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <Upload size={20} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-zinc-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className={`h-12 w-12 flex items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${isDragging ? "bg-blue-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    <span className="text-blue-500">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">MP4, MOV up to 2GB</p>
                </div>
                <input
                  type="file"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="video/*"
                />
              </>
            )}
          </div>

          {/* Validation Messages */}
          {error && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!!error || (!url && !file) || interrupted}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:shadow-none"
            >
              Start Generating Clips
            </button>
            {(url || file || error) && (
              <button
                type="button"
                onClick={resetForm}
                className="h-12 px-6 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
