import { motion, useReducedMotion } from "framer-motion";
import { LockKeyhole, Pin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AuroraBackground from "../layout/AuroraBackground.jsx";
import Logo from "../ui/Logo.jsx";

const notes = [
  {
    className: "left-[8%] top-[15%] -rotate-6 border-violet/30 bg-violet/15 text-white/80",
    accent: "border-violet/30 bg-violet/15 text-white/80",
    icon: Sparkles,
    title: "A bright idea",
    text: "Start anywhere.",
    delay: 0,
  },
  {
    className: "right-[7%] top-[38%] rotate-3 border-mint/30 bg-mint/10 text-mint",
    accent: "border-mint/30 bg-mint/10 text-mint",
    icon: Pin,
    title: "Keep it close",
    text: "Pin what matters.",
    delay: 0.8,
  },
  {
    className: "bottom-[12%] left-[22%] rotate-2 border-honey/30 bg-honey/10 text-honey",
    accent: "border-honey/30 bg-honey/10 text-honey",
    icon: LockKeyhole,
    title: "Safely yours",
    text: "Your thoughts, kept.",
    delay: 1.5,
  },
];

const quoteNotes = [
  { label: "A gentle reminder", quote: "Small steps still move you forward.", color: "bg-[#FFE39A] text-[#493B1B]", rotation: -5, delay: 0 },
  { label: "Today's thought", quote: "Make room for good things.", color: "bg-[#FFC4B2] text-[#542F28]", rotation: 4, delay: 0.65 },
  { label: "Keep this close", quote: "You are doing better than you think.", color: "bg-[#BDE8D2] text-[#20483A]", rotation: -3, delay: 1.25 },
];

/** Shared split layout and floating note artwork for authentication pages. */
export default function AuthLayout({ children, showQuoteNotes = false }) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink px-4 py-6 sm:px-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:px-10 lg:py-8">
      <AuroraBackground />
      <nav aria-label="Main navigation" className="relative z-10 col-span-full mx-auto flex w-full max-w-7xl items-center justify-end gap-2 pb-5">
        <Link to="/" className="rounded-lg px-3 py-2 text-sm text-cyber transition hover:bg-white/5 hover:text-white">Home</Link>
        <Link to="/dashboard" className="rounded-lg px-3 py-2 text-sm text-cyber transition hover:bg-white/5 hover:text-white">Dashboard</Link>
      </nav>
      <section className="relative z-10 mx-auto flex w-full max-w-2xl flex-col justify-center pb-8 lg:min-h-[calc(100vh-4rem)] lg:pb-0">
        <Link to="/" aria-label="Notes Keeper home" className="w-fit"><Logo size="large" /></Link>
        <div className={`relative mt-10 sm:mt-12 lg:mt-16 ${showQuoteNotes ? "" : "min-h-40 lg:min-h-[26rem]"}`}>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="relative z-10 max-w-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-[.24em] text-mint">A home for every thought</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white/95 sm:text-5xl xl:text-6xl">
              Write it. Pin it.<br /><span className="gradient-text">Never lose it.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
              Gather passing ideas, meaningful moments, and everything you want to remember in one calm space.
            </p>
          </motion.div>

          {!showQuoteNotes && notes.map(({ className, icon: Icon, title, text, delay }) => (
            <motion.div
              key={title}
              aria-hidden="true"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={reduceMotion ? { opacity: 0.85 } : { opacity: 0.85, y: [0, -10, 0], rotate: [0, 2, 0] }}
              transition={reduceMotion ? { duration: 0 } : { opacity: { duration: 0.5, delay }, y: { duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }, rotate: { duration: 7 + delay, repeat: Infinity, ease: "easeInOut", delay } }}
              className={`absolute z-0 hidden w-44 rounded-2xl border p-4 shadow-xl backdrop-blur-sm md:block ${className}`}
            >
              <Icon size={17} />
              <p className="mt-4 text-sm font-semibold text-white/90">{title}</p>
              <p className="mt-1 text-xs text-white/55">{text}</p>
            </motion.div>
          ))}
        </div>
        {showQuoteNotes ? (
          <div aria-label="Floating quote notes" className="relative z-10 mt-8 flex w-full max-w-lg items-start justify-between gap-2 sm:mt-10">
            {quoteNotes.map(({ label, quote, color, rotation, delay }) => (
              <motion.blockquote
                key={label}
                initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.9, rotate: rotation }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: [0, -7, 0], rotate: [rotation, rotation + 1.5, rotation] }}
                transition={reduceMotion ? { duration: 0 } : {
                  opacity: { duration: 0.4, delay },
                  y: { duration: 3.8 + delay, repeat: Infinity, ease: "easeInOut", delay },
                  rotate: { duration: 4.8 + delay, repeat: Infinity, ease: "easeInOut", delay },
                }}
                whileHover={reduceMotion ? undefined : { y: -8, scale: 1.05, rotate: rotation }}
                className={`relative flex aspect-square w-[84px] shrink-0 flex-col justify-center overflow-hidden rounded-[3px] px-2 pb-2 pt-5 shadow-lg shadow-black/20 ring-1 ring-black/[.06] sm:w-28 sm:px-3 ${color}`}
              >
                <span aria-hidden="true" className="absolute left-1/2 top-1.5 h-3 w-9 -translate-x-1/2 rotate-2 rounded-[2px] bg-white/45 shadow-sm" />
                <span className="text-[6px] font-bold uppercase leading-[.55rem] tracking-[.04em] opacity-60 sm:text-[8px] sm:leading-3">{label}</span>
                <p className="mt-1 font-display text-[9px] font-semibold leading-[.7rem] sm:text-xs sm:leading-4">&ldquo;{quote}&rdquo;</p>
              </motion.blockquote>
            ))}
          </div>
        ) : (
        <div className="relative z-10 mt-5 flex gap-2 md:hidden">
          {notes.map(({ accent, icon: Icon, title, delay }) => (
            <motion.div
              key={title}
              aria-hidden="true"
              animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
              transition={reduceMotion ? undefined : { duration: 3.8 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
              className={`min-w-0 flex-1 rounded-xl border p-2.5 ${accent}`}
            >
              <Icon size={14} />
              <p className="mt-2 truncate text-[10px] font-medium text-white/80">{title}</p>
            </motion.div>
          ))}
        </div>
        )}
      </section>

      <section className="relative z-10 mx-auto flex w-full max-w-xl items-center justify-center lg:min-h-[calc(100vh-4rem)]">
        {children}
      </section>
    </main>
  );
}
