import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Text input with a floating label, animated focus border, and inline error. */
export default function Input({
  id,
  label,
  error,
  endAdornment,
  className = "",
  wrapperClassName = "",
  ...props
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div className={`space-y-2 ${wrapperClassName}`}>
      <div className="animated-gradient-border rounded-xl">
        <div className="relative rounded-xl bg-ink p-px">
          <input
            id={id}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            placeholder=" "
            className={`peer min-h-14 w-full rounded-[11px] border border-white/10 bg-ink px-4 pb-2 pt-6 text-sm text-white/95 outline-none transition placeholder:text-transparent focus:border-transparent focus-visible:ring-2 focus-visible:ring-violet ${endAdornment ? "pr-12" : ""} ${className}`}
            {...props}
          />
          {label && (
            <label
              htmlFor={id}
              className="pointer-events-none absolute left-4 top-2 origin-left text-[11px] font-medium text-white/45 transition-all peer-placeholder-shown:top-[18px] peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-mint"
            >
              {label}
          </label>
          )}
          {endAdornment && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">{endAdornment}</span>}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={reduceMotion ? false : { opacity: 0, height: 0, y: -5 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className="overflow-hidden text-xs text-coral"
          >
            <span className="block pt-1">{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
