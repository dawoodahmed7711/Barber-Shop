"use client";

import { useEffect, useRef } from "react";

// Accessible confirmation dialog using the native <dialog> element.
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Keep it",
  onConfirm,
  onCancel,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onCancel();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-white p-0 text-navy shadow-lift backdrop:bg-navy/50"
    >
      <div className="p-6">
        <h2 id="confirm-title" className="text-xl font-bold">{title}</h2>
        <p id="confirm-message" className="mt-2 text-sm leading-relaxed text-slate">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
