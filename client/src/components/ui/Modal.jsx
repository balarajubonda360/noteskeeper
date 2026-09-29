import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

/** Accessible dialog with a blurred backdrop and spring entrance. */
export default function Modal({ open, onClose, title, children, layoutId }) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const focusFirst = window.setTimeout(() => {
      const dialog = dialogRef.current;
      const first = dialog?.querySelector("input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex='0']");
      (first || dialog)?.focus();
    }, 0);
    const closeOnEscape = (event) => {
      const dialogs = [...document.querySelectorAll('[role="dialog"]')];
      const topDialog = dialogs.at(-1);
      if (event.key === "Escape" && topDialog === dialogRef.current) onClose();
      if (event.key !== "Tab") return;
      if (topDialog !== dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")].filter((item) => item.offsetParent !== null);
      if (!focusable.length) { event.preventDefault(); dialogRef.current?.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => { window.clearTimeout(focusFirst); window.removeEventListener("keydown", closeOnEscape); previousFocus?.isConnected && previousFocus.focus(); };
  }, [open, onClose]);

  return createPortal((
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-md"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
        >
          <motion.section
            role="dialog"
            tabIndex={-1}
            ref={dialogRef}
            aria-modal="true"
            aria-labelledby={titleId}
            layoutId={layoutId}
            className="glass glow-violet w-full max-w-lg rounded-2xl p-6 shadow-2xl focus:outline-none"
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", damping: 24, stiffness: 280 }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 id={titleId} className="font-display text-xl font-semibold">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white">
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  ), document.body);
}
