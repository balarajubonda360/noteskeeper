import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

const themes = {
  violet: "border-violet/20 bg-violet/10 text-violet",
  honey: "border-honey/20 bg-honey/10 text-honey",
  mint: "border-mint/20 bg-mint/10 text-mint",
  coral: "border-coral/20 bg-coral/10 text-coral",
};

/** Metric card with a number that counts up when the card appears. */
export default function StatCard({ icon: Icon, label, value = 0, theme = "violet", delay = 0 }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      count.set(Number(value) || 0);
      return undefined;
    }
    const animation = animate(count, Number(value) || 0, {
      duration: 0.9,
      delay,
      ease: "easeOut",
    });
    return animation.stop;
  }, [count, delay, reduceMotion, value]);

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : delay }}
      className="glass rounded-2xl p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-white/50 sm:text-sm">{label}</p>
          <motion.p className="mt-3 font-display text-3xl font-semibold text-white/95 sm:text-4xl">
            {rounded}
          </motion.p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-xl border ${themes[theme]}`}>
          <Icon size={19} />
        </span>
      </div>
    </motion.article>
  );
}
