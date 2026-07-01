"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info", title?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, title }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => toast(message, "success", title),
    [toast]
  );

  const error = useCallback(
    (message: string, title?: string) => toast(message, "error", title),
    [toast]
  );

  const info = useCallback(
    (message: string, title?: string) => toast(message, "info", title),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const icons = {
              success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
              error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
              info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
            };

            const colors = {
              success: "border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100",
              error: "border-rose-500/20 bg-rose-50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-100",
              info: "border-blue-500/20 bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100",
            };

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                className={`flex items-start gap-3 p-4 border rounded-xl shadow-lg pointer-events-auto backdrop-blur-md ${colors[t.type]}`}
              >
                {icons[t.type]}
                <div className="flex-1 space-y-0.5">
                  {t.title && (
                    <h5 className="font-semibold text-sm leading-none">
                      {t.title}
                    </h5>
                  )}
                  <p className="text-xs leading-normal opacity-90">
                    {t.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
