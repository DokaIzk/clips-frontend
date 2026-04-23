"use client";

import React, { useState } from "react";
import { 
  Send, 
  Trash2, 
  Download, 
  Zap, 
  MoveRight,
  Loader2,
  AlertCircle,
  X,
  RefreshCw
} from "lucide-react";
import { MockApi } from "@/app/lib/mockApi";

interface SelectionFooterProps {
  count: number;
  selectedIds?: string[];
}

function getPostErrorMessage(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (msg === "NETWORK_ERROR") return "Network error — check your connection and retry.";
  if (msg === "PLATFORM_AUTH_EXPIRED") return "Platform authorization expired. Reconnect your account and retry.";
  return "Failed to post clips. Please try again.";
}

export default function SelectionFooter({ count, selectedIds = [] }: SelectionFooterProps) {
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  if (count === 0) return null;

  async function handlePost() {
    setPosting(true);
    setPostError(null);
    try {
      await MockApi.postClips(selectedIds);
    } catch (err) {
      setPostError(getPostErrorMessage(err));
      setRetryCount((c) => c + 1);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="w-full py-6 animate-in slide-in-from-bottom-5 fade-in duration-500 border-t border-white/5 bg-[#050505]/40 backdrop-blur-md">
      {/* Error Banner */}
      {postError && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-3 mb-4 mx-1">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-[13px] text-red-300 flex-1">{postError}</p>
          {retryCount >= 3 && (
            <span className="text-[11px] text-red-400/60 shrink-0">Try reconnecting your platform account.</span>
          )}
          <button
            onClick={() => setPostError(null)}
            className="text-red-400/60 hover:text-red-300 transition-colors shrink-0"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="relative bg-[#0B100E] border border-white/10 rounded-[32px] px-8 py-4 flex flex-col lg:flex-row items-center justify-between gap-6 w-full shadow-2xl">
        {/* Left: Selection Count */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#00E58F] flex items-center justify-center text-black font-black text-[16px]">
            {count}
          </div>
          <div className="space-y-0.5">
            <p className="text-[16px] font-extrabold text-white">Clips selected</p>
            <p className="text-[12px] font-medium text-[#5A6F65]">Ready for batch export or posting</p>
          </div>
        </div>

        {/* Middle: Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[#5A6F65]">
          <button className="flex items-center gap-2.5 px-6 py-3 rounded-2xl border border-white/5 bg-white/[0.02] text-[13px] font-bold hover:text-white hover:border-white/10 transition-all">
            <Download className="w-4 h-4" />
            <span>Export Clips</span>
          </button>
          <button className="flex items-center gap-2.5 px-6 py-3 rounded-2xl border border-white/5 bg-white/[0.02] text-[13px] font-bold hover:text-white hover:border-white/10 transition-all">
            <Trash2 className="w-4 h-4" />
            <span>Delete Permanently</span>
          </button>
        </div>

        {/* Right: Primary Platform Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#111815] border border-[#1A2621] text-brand font-black text-[12px] group hover:border-brand/40 transition-all">
            <Zap className="w-4 h-4 fill-brand" />
            <span>AUTO-SCHEDULE ON</span>
          </button>
          
          <button
            onClick={handlePost}
            disabled={posting}
            className="flex items-center gap-3 px-10 py-4 rounded-3xl bg-[#00E58F] text-black font-black text-[15px] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 shadow-[0_10px_30px_rgba(0,229,143,0.2)]"
          >
            {posting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Posting...</span>
              </>
            ) : postError ? (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Retry</span>
              </>
            ) : (
              <>
                <span>Post Selected Clips</span>
                <MoveRight className="w-5 h-5 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
