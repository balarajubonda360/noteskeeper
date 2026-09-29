import { motion, useReducedMotion } from "framer-motion";

const formatDate = (dateString) => new Date(`${dateString}T00:00:00Z`).toLocaleDateString(undefined, {
  weekday: "short",
  timeZone: "UTC",
});

/** Seven-day note activity chart made from accessible, animated div bars. */
export default function StatsPanel({ days = [] }) {
  const reduceMotion = useReducedMotion();
  const maximum = Math.max(1, ...days.map((day) => day.count));

  return (
    <section className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-white/90">Your activity</h2>
          <p className="mt-1 text-xs text-white/45">Notes created over the last 7 days</p>
        </div>
        <span className="text-xs text-mint">Last 7 days</span>
      </div>

      <div role="img" aria-label="Daily notes created during the last seven days" className="mt-6 flex h-40 items-end gap-2 sm:h-48 sm:gap-4">
        {days.map((day, index) => {
          const height = day.count === 0 ? 3 : Math.max(8, (day.count / maximum) * 100);
          return (
            <div key={day.date} className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end">
              <div className="pointer-events-none absolute bottom-[calc(100%-1.5rem)] z-10 hidden -translate-y-1 rounded-lg border border-white/10 bg-ink px-2.5 py-1.5 text-center text-[11px] text-white shadow-xl group-hover:block group-focus-within:block sm:whitespace-nowrap">
                <p className="font-medium">{day.count} {day.count === 1 ? "note" : "notes"}</p>
                <p className="text-white/45">{formatDate(day.date)}</p>
              </div>
              <motion.div
                tabIndex={0}
                aria-label={`${day.count} notes on ${formatDate(day.date)}`}
                initial={reduceMotion ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : index * 0.08, ease: "easeOut" }}
                style={{ originY: 1, height: `${height}%` }}
                className="w-full max-w-12 cursor-default rounded-t-lg bg-gradient-to-t from-violet to-coral shadow-[0_0_18px_rgba(47,175,154,.16)] outline-none focus-visible:ring-2 focus-visible:ring-mint"
              />
              <span className="mt-2 text-[10px] text-white/40 sm:text-xs">{formatDate(day.date)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
