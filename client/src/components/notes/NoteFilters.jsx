import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { notePalette } from "./ColorPicker.jsx";

const fields = [
  ["category", "Category"], ["status", "Status"], ["tag", "Tag"], ["from", "From"], ["to", "To"], ["sort", "Sort"],
];
const statusLabels = { active: "Active", pinned: "Pinned", archived: "Archived", trashed: "Trash" };

export default function NoteFilters({ params, categories, onChange, onClear }) {
  const reduceMotion = useReducedMotion();
  const update = (key, value) => onChange(key, value);
  const categoryName = categories.find((item) => item._id === params.category)?.name;
  const active = fields.flatMap(([key, label]) => params[key] ? [{ key, label, value: key === "category" ? categoryName || "Category" : key === "status" ? statusLabels[params[key]] || params[key] : key === "sort" ? ({ newest: "Newest", oldest: "Oldest", title: "Title" }[params[key]]) : params[key] }] : []);
  if (params.color) active.push({ key: "color", label: "Color", value: params.color });
  const selectClass = "h-10 rounded-xl border border-white/10 bg-ink px-3 text-xs text-white/75 outline-none focus:border-violet/50";
  return <section className="space-y-3" aria-label="Filter notes">
    <div className="flex flex-wrap items-center gap-2">
      <select aria-label="Filter by category" value={params.category || ""} onChange={(e) => update("category", e.target.value)} className={selectClass}><option value="">All categories</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
      <div className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-ink px-3" aria-label="Filter by color">{Object.entries(notePalette).map(([key, color]) => <button key={key} type="button" title={key} aria-label={`${key} color`} aria-pressed={params.color === key} onClick={() => update("color", params.color === key ? "" : key)} className={`h-4 w-4 rounded-full ${params.color === key ? "ring-2 ring-white ring-offset-2 ring-offset-ink" : ""}`} style={{ backgroundColor: color }} />)}</div>
      <select aria-label="Filter by status" value={params.status || ""} onChange={(e) => update("status", e.target.value)} className={selectClass}><option value="">Any status</option><option value="active">Active</option><option value="pinned">Pinned</option><option value="archived">Archived</option><option value="trashed">Trash</option></select>
      <input aria-label="Filter by tag" value={params.tag || ""} onChange={(e) => update("tag", e.target.value)} placeholder="Tag" className={`${selectClass} w-24`} />
      <input aria-label="Filter from date" type="date" value={params.from || ""} onChange={(e) => update("from", e.target.value)} className={selectClass} />
      <input aria-label="Filter to date" type="date" value={params.to || ""} onChange={(e) => update("to", e.target.value)} className={selectClass} />
      <select aria-label="Sort notes" value={params.sort || "newest"} onChange={(e) => update("sort", e.target.value)} className={selectClass}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="title">Title</option></select>
    </div>
    <AnimatePresence>{active.length > 0 && <motion.div initial={{ opacity: 0, ...(reduceMotion ? {} : { height: 0 }) }} animate={{ opacity: 1, ...(reduceMotion ? {} : { height: "auto" }) }} exit={{ opacity: 0, ...(reduceMotion ? {} : { height: 0 }) }} className="flex flex-wrap items-center gap-2 overflow-hidden">{active.map(({ key, label, value }) => <motion.button layout={!reduceMotion} key={key} type="button" onClick={() => update(key, "")} className="inline-flex items-center gap-1.5 rounded-full border border-mint/20 bg-mint/10 px-3 py-1.5 text-xs text-mint">{label}: {value}<X size={13} /></motion.button>)}<button type="button" onClick={onClear} className="px-2 py-1 text-xs text-white/45 underline-offset-2 hover:text-white hover:underline">Clear all</button></motion.div>}</AnimatePresence>
  </section>;
}
