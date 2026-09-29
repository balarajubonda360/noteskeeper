import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Archive, ArrowUpRight, NotebookPen, Pin, Plus, Sparkles, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState.jsx";
import Button from "../components/ui/Button.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import StatCard from "../components/stats/StatCard.jsx";
import StatsPanel from "../components/stats/StatsPanel.jsx";
import useAuth from "../hooks/useAuth.js";
import { filterNotes, getStats } from "../services/noteService.js";

const palette = {
  violet: "#2FAF9A",
  mint: "#FF9F86",
  coral: "#FDF2F0",
  navy: "#1B3A3C",
};
const colorNames = ["violet", "mint", "coral", "navy"];
const quoteNotes = [
  { quote: "Small steps still move you forward.", label: "A gentle reminder", paper: "bg-[#FFE39A] text-[#493B1B]", tilt: -5, drift: -9, delay: 0, size: "w-52 min-h-36" },
  { quote: "Make room for good things.", label: "Today's thought", paper: "bg-[#FFC4B2] text-[#542F28]", tilt: 4, drift: 8, delay: 0.6, size: "w-48 min-h-32" },
  { quote: "You are doing better than you think.", label: "Keep this close", paper: "bg-[#BDE8D2] text-[#20483A]", tilt: -3, drift: -7, delay: 1.1, size: "w-56 min-h-40" },
  { quote: "Great things take the time they take.", label: "One day at a time", paper: "bg-[#D8D1FF] text-[#3D3567]", tilt: 5, drift: 10, delay: 1.7, size: "w-48 min-h-36" },
];

const greetingForHour = (hour) => {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const prettyDate = (value) => new Date(value).toLocaleDateString(undefined, {
  month: "short",
  day: "numeric",
});

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading dashboard">
      <div className="space-y-3 py-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-9 w-72 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28 rounded-2xl" />)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
      <Skeleton className="h-52 rounded-2xl" />
    </div>
  );
}

function NotesByColor({ values = [] }) {
  const reduceMotion = useReducedMotion();
  const counts = useMemo(() => values.reduce((result, { color, count }) => {
    const key = color === "gold" ? "violet" : color;
    result[key] = (result[key] || 0) + count;
    return result;
  }, {}), [values]);
  const maximum = Math.max(1, ...colorNames.map((color) => counts[color] || 0));

  return (
    <section className="glass rounded-2xl p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-white/90">Notes by color</h2>
      <p className="mt-1 text-xs text-white/45">Your palette at a glance</p>
      <div className="mt-5 space-y-3.5">
        {colorNames.map((color) => {
          const count = counts[color] || 0;
          return (
            <div key={color} className="grid grid-cols-[5.5rem_1fr_2rem] items-center gap-3">
              <span className="flex items-center gap-2 text-xs capitalize text-white/60">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: palette[color] }} />
                {color === "violet" ? "aqua alloy" : color === "mint" ? "peach shell" : color === "coral" ? "mist porcelain" : "shadow ink"}
              </span>
              <div className="h-2 overflow-hidden rounded-full bg-white/[.07]">
                <motion.div
                  initial={reduceMotion ? false : { width: 0 }}
                  animate={{ width: `${(count / maximum) * 100}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: palette[color] }}
                />
              </div>
              <span className="text-right text-xs tabular-nums text-white/45">{count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TopCategories({ categories = [] }) {
  const reduceMotion = useReducedMotion();
  const topCategories = [...categories].sort((a, b) => b.count - a.count).slice(0, 5);
  const maximum = Math.max(1, ...topCategories.map(({ count }) => count));

  return (
    <section className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-semibold text-white/90">Top categories</h2>
          <p className="mt-1 text-xs text-white/45">Where your notes gather</p>
        </div>
        <ArrowUpRight size={17} className="text-mint/70" />
      </div>
      {topCategories.length ? (
        <div className="mt-5 space-y-4">
          {topCategories.map(({ category, count }, index) => (
            <div key={category}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                <span className="truncate text-white/70">{category}</span>
                <span className="text-white/40">{count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[.07]">
                <motion.div
                  initial={reduceMotion ? false : { width: 0 }}
                  animate={{ width: `${(count / maximum) * 100}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : index * 0.08 }}
                  className="h-full rounded-full bg-gradient-to-r from-violet to-cyber"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-7 text-sm text-white/40">Create a category to see it here.</p>
      )}
    </section>
  );
}

function RecentNotes({ notes, onOpenNotes }) {
  const reduceMotion = useReducedMotion();
  if (!notes.length) {
    return (
      <section className="glass rounded-2xl p-3 sm:p-5">
        <EmptyState
          icon={<NotebookPen size={24} />}
          title="A little room for your first thought"
          description="Write something down and it will be here whenever you need it."
          action={<button type="button" onClick={onOpenNotes} className="rounded-xl bg-violet px-4 py-2.5 text-sm font-semibold text-white">Write your first note</button>}
        />
      </section>
    );
  }

  return (
    <section className="glass rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-white/90">Recent notes</h2>
          <p className="mt-1 text-xs text-white/45">Fresh thoughts from your workspace</p>
        </div>
        <button type="button" onClick={onOpenNotes} className="text-xs font-medium text-mint transition hover:text-white">View all</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {notes.slice(0, 5).map((note, index) => (
          <motion.button
            key={note._id}
            type="button"
            onClick={onOpenNotes}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : index * 0.06 }}
            whileHover={reduceMotion ? undefined : { y: -3 }}
            className="rounded-xl border border-white/10 bg-white/[.035] p-3 text-left transition hover:border-violet/35 hover:bg-white/[.06]"
          >
            <span className="mb-3 block h-1 w-8 rounded-full" style={{ backgroundColor: palette[note.color] || palette.violet }} />
            <span className="block truncate text-sm font-medium text-white/85">{note.title}</span>
            <span className="mt-1 line-clamp-2 block min-h-8 text-xs leading-4 text-white/40">{note.content}</span>
            <span className="mt-3 block text-[10px] text-white/30">{prettyDate(note.createdAt)}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function FloatingQuoteNotes() {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-label="A few notes to keep close" className="relative overflow-hidden px-4 py-7 sm:px-7 sm:py-9">
      <div className="mb-5 text-center sm:mb-2 sm:text-left">
        <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-mint">A little encouragement</p>
        <h2 className="mt-1 font-display text-lg font-semibold text-white/85">Keep these close</h2>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-x-5 gap-y-3 sm:justify-between sm:gap-x-3 sm:gap-y-0">
        {quoteNotes.map(({ quote, label, paper, tilt, drift, delay, size }, index) => (
          <motion.blockquote
            key={label}
            initial={reduceMotion ? false : { opacity: 0, y: 16, rotate: tilt }}
            animate={reduceMotion ? { opacity: 1, rotate: tilt } : { opacity: 1, y: [0, drift, 0], rotate: [tilt, tilt + 1.5, tilt] }}
            transition={reduceMotion ? { duration: 0 } : {
              opacity: { duration: 0.45, delay: delay * 0.35 },
              y: { duration: 4.5 + index * 0.35, repeat: Infinity, ease: "easeInOut", delay },
              rotate: { duration: 5.2 + index * 0.3, repeat: Infinity, ease: "easeInOut", delay },
            }}
            whileHover={reduceMotion ? undefined : { scale: 1.045, rotate: 0, zIndex: 2 }}
            className={`relative ${size} max-w-full shrink-0 px-4 pb-4 pt-5 shadow-xl shadow-black/20 ${paper} ${index % 2 === 0 ? "sm:mt-5" : "sm:mt-0"}`}
          >
            <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-2 rounded-sm bg-white/45" />
            <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[.14em] opacity-60"><Sparkles size={11} />{label}</span>
            <p className="mt-3 font-display text-sm font-semibold leading-5">“{quote}”</p>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}

/** Authenticated dashboard populated by the note statistics and list APIs. */
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [stats, setStats] = useState(null);
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [statsResponse, notesResponse] = await Promise.all([
        getStats(),
        filterNotes({ sort: "newest", page: 1, limit: 5 }),
      ]);
      setStats(statsResponse.data);
      setRecentNotes(notesResponse.data || []);
    } catch (error) {
      const message = error.response?.data?.message || "Couldn't load your dashboard. Check your connection and try again.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const fullName = user?.name?.trim().replace(/\s+/g, " ") || "there";
  const greeting = greetingForHour(new Date().getHours());
  const totals = stats?.totals || {};

  if (loading) return <DashboardSkeleton />;
  if (loadError) return <section role="alert" className="glass space-y-4 rounded-2xl p-6"><h1 className="font-display text-xl font-semibold text-white">Dashboard unavailable</h1><p className="text-sm text-white/70">{loadError}</p><Button variant="ghost" onClick={loadDashboard}>Try again</Button></section>;

  return (
    <div className="space-y-5 pb-16 sm:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4 py-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-mint">Your Notes Keeper at a glance</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-white/95 sm:text-3xl">
            {greeting}, {fullName}{" "}
            <motion.span
              aria-label="wave"
              role="img"
              animate={reduceMotion ? undefined : { rotate: [0, 18, -8, 18, 0] }}
              transition={reduceMotion ? undefined : { duration: 1.4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              className="inline-block origin-[70%_70%]"
            >{"\u{1F44B}"}</motion.span>
          </h1>
        </div>
      </header>

      <section aria-label="Note totals" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon={NotebookPen} label="Total Notes" value={totals.total} theme="violet" delay={0} />
        <StatCard icon={Pin} label="Pinned" value={totals.pinned} theme="honey" delay={0.08} />
        <StatCard icon={Archive} label="Archived" value={totals.archived} theme="mint" delay={0.16} />
        <StatCard icon={Trash2} label="Trashed" value={totals.trashed} theme="coral" delay={0.24} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <StatsPanel days={stats?.last7Days || []} />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <NotesByColor values={stats?.byColor || []} />
          <TopCategories categories={stats?.byCategory || []} />
        </div>
      </section>

      {totals.total === 0 ? (
        <RecentNotes notes={[]} onOpenNotes={() => navigate("/notes")} />
      ) : (
        <RecentNotes notes={recentNotes} onOpenNotes={() => navigate("/notes")} />
      )}

      <FloatingQuoteNotes />

      <motion.button
        type="button"
        onClick={() => navigate("/notes")}
        whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        className="pulse-glow fixed bottom-24 right-5 z-20 inline-flex items-center gap-2 rounded-2xl bg-violet px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet/25 transition hover:bg-violet/90 sm:bottom-7 sm:right-8"
      >
        <Plus size={18} strokeWidth={2.5} /> New Note
      </motion.button>
    </div>
  );
}
