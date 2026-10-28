"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (message, type = "info") => {
      idRef.current += 1;
      const id = idRef.current;
      setToasts((t) => [...t.slice(-3), { id, message, type }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), 5000)
      );
    },
    [dismiss]
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((timer) => clearTimeout(timer));
      map.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          const color =
            t.type === "success"
              ? "text-green-600"
              : t.type === "error"
              ? "text-red-600"
              : "text-royal";
          return (
            <div
              key={t.id}
              role={t.type === "error" ? "alert" : "status"}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-white p-4 shadow-lift"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} aria-hidden="true" />
              <p className="flex-1 text-sm text-navy">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="rounded p-1 text-slate hover:text-navy"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
