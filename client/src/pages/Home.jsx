import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, LockKeyhole, Pin, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AuroraBackground from "../components/layout/AuroraBackground.jsx";
import Logo from "../components/ui/Logo.jsx";

const MotionLink = motion(Link);

const highlights = [
  { icon: Pin, title: "Keep the important close", text: "Pin key notes so they stay easy to find.", action: "See pinned notes", to: "/notes?status=pinned" },
  { icon: Search, title: "Find a thought fast", text: "Search and filter your notes when you need them.", action: "Explore your notes", to: "/notes" },
  { icon: LockKeyhole, title: "A space that is yours", text: "Keep your personal workspace organized and private.", action: "Open your workspace", to: "/dashboard" },
];

const happyNotes = [
  { quote: "Small steps still move you forward.", label: "A gentle reminder", color: "bg-[#FFE39A] text-[#493B1B]", tilt: "-rotate-6", position: "left-[-12px] top-[-30px]", delay: 0 },
  { quote: "Make room for good things.", label: "Today's thought", color: "bg-[#FFC4B2] text-[#542F28]", tilt: "rotate-6", position: "right-[-20px] top-[34%]", delay: 0.7 },
  { quote: "You are doing better than you think.", label: "Keep this close", color: "bg-[#BDE8D2] text-[#20483A]", tilt: "-rotate-3", position: "left-[-24px] bottom-[18px]", delay: 1.3 },
];

export default function Home() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-ink px-5 py-6 text-white sm:px-8 lg:px-12">
      <AuroraBackground />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col">
        <header className="flex items-center justify-between">
          <Link to="/" aria-label="Notes Keeper home"><Logo size="landing" /></Link>
          <nav aria-label="Main navigation" className="flex items-center gap-1">
            <Link to="/" aria-current="page" className="rounded-xl px-3 py-2.5 text-sm font-medium text-cyber">Home</Link>
            <Link to="/dashboard" className="rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white">Dashboard</Link>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/10 px-3 py-1.5 text-xs font-medium text-mint">
              <Sparkles size={14} /> A calmer place for your thoughts
            </span>
            <h1 className="mt-7 font-display text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Catch every idea.<br /><span className="gradient-text">Keep what matters.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              Notes Keeper brings your notes, lists, and passing thoughts into one focused workspace. Organize them your way and find them again in seconds.
            </p>
            <div className="mt-9">
              <MotionLink
                to="/account"
                animate={reduceMotion ? undefined : { y: [0, -4, 0], rotate: [-1, 1, -1] }}
                whileHover={reduceMotion ? undefined : { scale: 1.04, y: -5, rotate: 0, boxShadow: "0 12px 30px rgba(47, 175, 154, .3)", transition: { type: "spring", stiffness: 380, damping: 22 } }}
                whileTap={reduceMotion ? undefined : { scale: 0.97, rotate: 0, transition: { type: "spring", stiffness: 500, damping: 24 } }}
                transition={reduceMotion ? undefined : {
                  y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-cyber px-5 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-cyber/15 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Get started
                <motion.span aria-hidden="true" animate={reduceMotion ? undefined : { x: [0, 3, 0] }} transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                  <ArrowRight size={16} />
                </motion.span>
              </MotionLink>
            </div>
          </motion.div>

          <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
            <div aria-hidden="true" className="absolute inset-8 rounded-full bg-cyber/15 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 z-20 hidden xl:block" aria-label="Happy reminders">
              {happyNotes.map(({ quote, label, color, tilt, position, delay }) => (
                <motion.blockquote
                  key={quote}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.82, y: 12 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: [0, -8, 0], rotate: [0, 1.5, 0] }}
                  transition={reduceMotion ? { duration: 0 } : { opacity: { duration: 0.45, delay }, y: { duration: 4.2 + delay, repeat: Infinity, ease: "easeInOut", delay }, rotate: { duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay } }}
                  className={`absolute ${position} w-40 rounded-sm px-4 pb-4 pt-5 shadow-xl shadow-black/25 ${color} ${tilt}`}
                >
                  <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-2 rounded-sm bg-white/45" />
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.12em] opacity-60"><Sparkles size={12} />{label}</span>
                  <p className="mt-2 font-display text-sm font-semibold leading-5">“{quote}”</p>
                </motion.blockquote>
              ))}
            </div>
            <div className="relative rotate-[-2deg] rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div><p className="text-xs text-white/40">YOUR WORKSPACE</p><p className="mt-1 text-sm font-medium text-white/85">A little more clarity</p></div>
                <span className="rounded-lg bg-mint/10 px-2.5 py-1 text-xs text-mint">Today</span>
              </div>
              <div className="grid gap-3 pt-4">
                <article className="relative overflow-hidden rounded-2xl border border-honey/20 bg-honey/[0.08] p-4 sm:p-5">
                  <img src="/idea-lamp.svg" alt="" aria-hidden="true" className="pointer-events-none absolute right-5 top-1/2 h-24 w-24 -translate-y-1/2 opacity-75 sm:right-8 sm:h-28 sm:w-28" />
                  <div className="relative z-10 max-w-[72%]">
                    <div className="flex items-center gap-2 text-honey"><Pin size={15} /><span className="text-xs font-medium">PINNED</span></div>
                    <h2 className="mt-3 font-display text-lg font-semibold text-white/90">Ideas worth keeping</h2>
                    <p className="mt-2 text-sm leading-6 text-white/55">Collect the little sparks before they slip away.</p>
                    <div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/50">Ideas</span><span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/50">Personal</span></div>
                  </div>
                </article>
                <div className="grid grid-cols-2 gap-3">
                  <article className="rounded-2xl border border-violet/20 bg-violet/[0.08] p-4">
                    <p className="text-xs text-violet">TO REMEMBER</p>
                    <img src="/open-book.svg" alt="Illustration of an open book" className="mx-auto mt-2 h-16 w-full object-contain" />
                    <p className="mt-1 text-sm font-medium text-white/80">Weekend reading list</p>
                  </article>
                  <article className="rounded-2xl border border-mint/20 bg-mint/[0.07] p-4"><p className="text-xs text-mint">QUICK NOTE</p><img src="/sticky-thought.svg" alt="A handwritten sticky note" className="mx-auto mt-1 h-14 w-full object-contain" /><p className="mt-1 text-sm font-medium text-white/80">Make room to think.</p></article>
                </div>
              </div>
            </div>
            <p className="mt-5 text-center text-xs text-white/35">Your notes, neatly in one place.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:hidden" aria-label="Happy reminders">
              {happyNotes.map(({ quote, label, color, tilt, delay }) => (
                <motion.blockquote
                  key={quote}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: [0, -4, 0] }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 3.6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
                  className={`relative rounded-sm px-3 pb-3 pt-4 shadow-lg shadow-black/15 ${color} ${tilt}`}
                >
                  <span aria-hidden="true" className="absolute -top-1.5 left-1/2 h-3 w-10 -translate-x-1/2 rounded-sm bg-white/45" />
                  <span className="text-[9px] font-bold uppercase tracking-[.1em] opacity-60">{label}</span>
                  <p className="mt-1.5 font-display text-xs font-semibold leading-4">“{quote}”</p>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Notes Keeper features" className="border-t border-white/10 py-10 sm:py-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-mint">A little space to think</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-white/90 sm:text-3xl">Good ideas deserve a place to land.</h2>
            <p className="mt-3 text-sm leading-6 text-white/50">Keep life’s little reminders, big plans, and bright ideas together—ready whenever you need them.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, title, text, action, to }, index) => (
              <motion.article
                key={title}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : index * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/[.03] transition-colors hover:border-mint/30 hover:bg-white/[.06]"
              >
                <Link to={to} className="group block h-full rounded-2xl p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint">
                  <span className="grid size-10 place-items-center rounded-xl bg-mint/10 text-mint transition-colors group-hover:bg-mint/20"><Icon size={18} /></span>
                  <h3 className="mt-4 text-sm font-semibold text-white/90">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/50">{text}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-mint">{action}<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </motion.article>
            ))}
          </div>
          <p className="mt-8 text-center font-display text-sm font-medium text-[#FFCF9A]">“One thought at a time. You’re doing great.”</p>
        </section>
      </div>
    </main>
  );
}
