"use client";

import { useEffect, useState, useCallback } from "react";

export type ProcessStatus = "idle" | "processing" | "complete" | "error";

export interface ProcessState {
  id: string;
  label: string;
  progress: number; // 0–100
  status: ProcessStatus;
  startedAt: number | null;
  completedAt: number | null;
  momentsFound: number;
  estimatedSecondsRemaining: number | null;
}

const STORAGE_KEY = "clips_process_state";

const defaultState: ProcessState = {
  id: "",
  label: "",
  progress: 0,
  status: "idle",
  startedAt: null,
  completedAt: null,
  momentsFound: 0,
  estimatedSecondsRemaining: null,
};

function loadFromStorage(): ProcessState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProcessState) : defaultState;
  } catch {
    return defaultState;
  }
}

function saveToStorage(state: ProcessState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useProcessStore() {
  const [process, setProcessState] = useState<ProcessState>(defaultState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setProcessState(loadFromStorage());
  }, []);

  const update = useCallback(
    (patch: Partial<ProcessState> | ((prev: ProcessState) => Partial<ProcessState>)) => {
      setProcessState((prev: ProcessState) => {
        const resolved = typeof patch === "function" ? patch(prev) : patch;
        const next = { ...prev, ...resolved };
        saveToStorage(next);
        return next;
      });
    },
    []
  );

  const startProcess = useCallback((id: string, label: string) => {
    const next: ProcessState = {
      id,
      label,
      progress: 0,
      status: "processing",
      startedAt: Date.now(),
      completedAt: null,
      momentsFound: 0,
      estimatedSecondsRemaining: null,
    };
    saveToStorage(next);
    setProcessState(next);
  }, []);

  const resetProcess = useCallback(() => {
    saveToStorage(defaultState);
    setProcessState(defaultState);
  }, []);

  return { process, update, startProcess, resetProcess };
}
