import React from 'react';
import { useUIStore } from '../store/uiStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none select-none">
      {toasts.map((toast) => {
        let bgClass = "bg-white dark:bg-zinc-900 text-dark dark:text-zinc-150 border-slate-100 dark:border-zinc-800";
        let iconColor = "text-primary";
        let iconSymbol = "ℹ️";

        if (toast.type === "success") {
          bgClass = "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30";
          iconColor = "text-emerald-500";
          iconSymbol = "✓";
        } else if (toast.type === "error") {
          bgClass = "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 border-rose-100 dark:border-rose-900/30";
          iconColor = "text-rose-500";
          iconSymbol = "✕";
        } else if (toast.type === "warning") {
          bgClass = "bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-100 dark:border-amber-900/30";
          iconColor = "text-amber-500";
          iconSymbol = "⚠";
        }

        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto cursor-pointer flex items-start gap-3.5 px-4 py-3.5 rounded-xl border shadow-lg ${bgClass} animate-in fade-in slide-in-from-bottom-4 duration-300 transform hover:scale-[1.02] active:scale-[0.98] transition-all`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 bg-white/60 dark:bg-black/20 ${iconColor}`}>
              {iconSymbol}
            </div>
            <div className="flex-1 text-xs font-semibold leading-relaxed whitespace-pre-line">
              {toast.message}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
              className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 text-xs font-bold leading-none cursor-pointer"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
