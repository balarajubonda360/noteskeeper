import { useEffect } from "react";
import { animate, useMotionValue, useReducedMotion, useTransform, motion } from "framer-motion";

export default function CountUp({ value = 0, className = "", duration = 0.7, ...props }) {
  const count = useMotionValue(0);
  const display = useTransform(count, (current) => Math.round(current).toLocaleString());
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) { count.set(Number(value) || 0); return undefined; }
    const control = animate(count, Number(value) || 0, { duration, ease: "easeOut" });
    return control.stop;
  }, [count, duration, reduceMotion, value]);
  return <motion.span className={className} {...props}>{display}</motion.span>;
}
