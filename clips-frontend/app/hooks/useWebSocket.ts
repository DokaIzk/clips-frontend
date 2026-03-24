"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export type SocketStatus = "connecting" | "connected" | "disconnected" | "error";

export interface WSProgressMessage {
  type: "progress";
  progress: number;       // 0–100
  momentsFound: number;
  estimatedSecondsRemaining: number | null;
}

export interface WSCompleteMessage {
  type: "complete";
  momentsFound: number;
}

export interface WSErrorMessage {
  type: "error";
  message: string;
}

export type WSMessage = WSProgressMessage | WSCompleteMessage | WSErrorMessage;

interface UseWebSocketOptions {
  url: string;
  enabled?: boolean;
  onMessage: (msg: WSMessage) => void;
  onStatusChange?: (status: SocketStatus) => void;
  maxRetries?: number;
}

const BASE_DELAY = 1000;
const MAX_DELAY = 30000;

export function useWebSocket({
  url,
  enabled = true,
  onMessage,
  onStatusChange,
  maxRetries = 10,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const [status, setStatus] = useState<SocketStatus>("disconnected");

  const updateStatus = useCallback(
    (s: SocketStatus) => {
      setStatus(s);
      onStatusChange?.(s);
    },
    [onStatusChange]
  );

  const connect = useCallback(() => {
    if (!mountedRef.current || !enabled) return;

    updateStatus("connecting");
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      retriesRef.current = 0;
      updateStatus("connected");
    };

    ws.onmessage = (event: MessageEvent) => {
      if (!mountedRef.current) return;
      try {
        const msg = JSON.parse(event.data as string) as WSMessage;
        onMessage(msg);
      } catch {
        // ignore malformed frames
      }
    };

    ws.onerror = () => {
      if (!mountedRef.current) return;
      updateStatus("error");
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      wsRef.current = null;

      if (retriesRef.current >= maxRetries) {
        updateStatus("disconnected");
        return;
      }

      // Exponential backoff with jitter
      const delay = Math.min(BASE_DELAY * 2 ** retriesRef.current, MAX_DELAY);
      const jitter = Math.random() * 500;
      retriesRef.current += 1;
      updateStatus("disconnected");

      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) connect();
      }, delay + jitter);
    };
  }, [url, enabled, onMessage, updateStatus, maxRetries]);

  const disconnect = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (enabled) connect();
    return () => {
      mountedRef.current = false;
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return { status };
}
