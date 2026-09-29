import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Archive, ArchiveRestore, Pencil, Pin, PinOff, RotateCcw, Star, Trash2 } from "lucide-react";
import { notePalette } from "./ColorPicker.jsx";

const relativeDate = (value) => {
  const date = new Date(value);
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const divisions = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let amount = seconds;
  for (const [range, unit] of divisions) {
    if (Math.abs(amount) < range) {
      return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(Math.round(amount), unit);
    }
    amount /= range;
  }
  return "Recently";
};

function ActionButton({ label, onClick, children, tone = "white" }) {
  const toneClasses = {
    white: "text-white/45 hover:bg-white/10 hover:text-white",
    honey: "text-honey/70 hover:bg-honey/10 hover:text-honey",
    mint: "text-mint/70 hover:bg-mint/10 hover:text-mint",
    coral: "text-coral/70 hover:bg-coral/10 hover:text-coral",
  };
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(event) => { event.stopPropagation(); onClick?.(); }}
      className={`grid h-8 w-8 place-items-center rounded-lg transition ${toneClasses[tone]}`}
    >
      {children}
    </button>
  );
}

/** A tinted note card with actions for its current workspace. */
export default function NoteCard({
  note,
  view = "notes",
  onEdit,
  onChangeStatus,
  onDeleteForever,
}) {
  const color = notePalette[note.color] || (note.color === "gold" ? notePalette.violet : notePalette.navy);
  const categoryName = typeof note.category === "object" ? note.category?.name : null;
  const isPinned = note.status === "pinned";
  const reduceMotion = useReducedMotion();
  const trackSpotlight = (event) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <motion.article
      layout
      layoutId={`note-card-${note._id}`}
      onMouseMove={trackSpotlight}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      whileHover={reduceMotion ? undefined : { y: -4, boxShadow: "0 14px 40px rgba(47,175,154,.16)" }}
      transition={{ duration: reduceMotion ? 0.25 : 0.25 }}
      className="note-spotlight group relative overflow-hidden rounded-2xl border border-white/10 p-4 backdrop-blur-xl"
      style={{ backgroundColor: `${color}12` }}
    >
      <span className="absolute inset-x-0 top-0 h-px opacity-60" style={{ backgroundColor: color }} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate font-display text-base font-semibold text-white/90">{note.title}</h2>
          <AnimatePresence>
            {isPinned && (
              <motion.span
                key="pinned-badge"
                initial={reduceMotion ? false : { scale: 0.35, y: -7, rotate: -18 }}
                animate={reduceMotion ? { opacity: 1 } : { scale: [0.35, 1.18, 1], y: [-7, 0, -2, 0], rotate: 0 }}
                transition={reduceMotion ? { duration: 0.2 } : { type: "spring", stiffness: 420, damping: 16 }}
                title="Pinned"
                className="shrink-0 text-honey"
              >
                <Pin size={14} fill="currentColor" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          {view === "trash" ? (
            <>
              <ActionButton label="Restore note" tone="mint" onClick={() => onChangeStatus(note._id, "active")}><RotateCcw size={15} /></ActionButton>
              <ActionButton label="Delete forever" tone="coral" onClick={() => onDeleteForever(note)}><Trash2 size={15} /></ActionButton>
            </>
          ) : view === "archive" ? (
            <>
              <ActionButton label="Unarchive note" tone="mint" onClick={() => onChangeStatus(note._id, "active")}><ArchiveRestore size={15} /></ActionButton>
              <ActionButton label="Edit note" onClick={() => onEdit(note)}><Pencil size={15} /></ActionButton>
              <ActionButton label="Move to trash" tone="coral" onClick={() => onChangeStatus(note._id, "trashed")}><Trash2 size={15} /></ActionButton>
            </>
          ) : (
            <>
              <ActionButton label={isPinned ? "Unpin note" : "Pin note"} tone="honey" onClick={() => onChangeStatus(note._id, isPinned ? "active" : "pinned")}>
                {isPinned ? <PinOff size={15} /> : <Star size={15} />}
              </ActionButton>
              <ActionButton label="Archive note" tone="mint" onClick={() => onChangeStatus(note._id, "archived")}><Archive size={15} /></ActionButton>
              <ActionButton label="Move to trash" tone="coral" onClick={() => onChangeStatus(note._id, "trashed")}><Trash2 size={15} /></ActionButton>
              <ActionButton label="Edit note" onClick={() => onEdit(note)}><Pencil size={15} /></ActionButton>
            </>
          )}
        </div>
      </div>

      <p className="mt-3 line-clamp-4 min-h-[5.5rem] whitespace-pre-wrap break-words text-sm leading-[1.4rem] text-white/60">{note.content}</p>

      <div className="mt-4 flex min-h-6 flex-wrap items-center gap-1.5">
        {(note.tags || []).map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 bg-white/[.045] px-2 py-1 text-[10px] text-white/55">#{tag}</span>
        ))}
        {categoryName && <span className="rounded-full border border-violet/25 bg-violet/10 px-2 py-1 text-[10px] text-white/80">{categoryName}</span>}
      </div>

      <footer className="mt-4 flex items-center justify-between border-t border-white/[.07] pt-3 text-[10px] text-white/35">
        <span>{relativeDate(note.updatedAt || note.createdAt)}</span>
        {note.status === "archived" && <span className="text-mint/70">Archived</span>}
      </footer>
    </motion.article>
  );
}
