import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const variants = {
  primary: "bg-violet text-white shadow-lg shadow-violet/20 hover:bg-violet/90",
  ghost: "border border-white/10 bg-white/5 text-white/85 hover:border-white/20 hover:bg-white/10",
  danger: "border border-coral/30 bg-coral/10 text-coral hover:bg-coral/20",
};

/** Shared animated button with a pointer ripple and optional busy state. */
export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  onPointerDown,
  ...props
}) {
  const [ripples, setRipples] = useState([]);
  const reduceMotion = useReducedMotion();

  const createRipple = (event) => {
    onPointerDown?.(event);
    const bounds = event.currentTarget.getBoundingClientRect();
    const ripple = {
      id: `${Date.now()}-${Math.random()}`,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    if (!reduceMotion) {
      setRipples((current) => [...current, ripple]);
      window.setTimeout(() => {
        setRipples((current) => current.filter((item) => item.id !== ripple.id));
      }, 600);
    }
  };

  return (
    <motion.button
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      disabled={disabled || loading}
      onPointerDown={createRipple}
      className={`relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {ripples.map((ripple) => (
        <span key={ripple.id} className="ripple-effect" style={{ left: ripple.x, top: ripple.y }} />
      ))}
      {loading && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />}
      <span className="relative z-[1] inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
