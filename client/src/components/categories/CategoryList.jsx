import * as Icons from "lucide-react";
import { Folder, Pencil, Plus, Trash2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { notePalette } from "../notes/ColorPicker.jsx";

export default function CategoryList({ categories, onCreate, onEdit, onDelete }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  if (!categories.length) return <button type="button" onClick={onCreate} className="glass flex min-h-52 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 text-sm text-white/55 hover:border-mint/40 hover:text-mint"><Plus size={24} />Create your first category</button>;
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{categories.map((category) => {
    const Icon = Icons[category.icon] || Folder;
    const openCategory = () => navigate(`/notes?category=${category._id}`);
    return <motion.article layout={!reduceMotion} key={category._id} role="link" tabIndex={0} aria-label={`Open ${category.name} category`} onKeyDown={(e) => { if (e.target !== e.currentTarget) return; if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCategory(); } }} onClick={openCategory} className={`glass group cursor-pointer rounded-2xl p-5 transition hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet ${reduceMotion ? "" : "hover:-translate-y-1"}`}>
      <div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-xl" style={{ color: notePalette[category.color] || notePalette.violet, backgroundColor: `${notePalette[category.color] || notePalette.violet}22` }}><Icon size={23} /></span><div className="flex gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"><button type="button" aria-label={`Edit ${category.name}`} onClick={(e) => { e.stopPropagation(); onEdit(category); }} className="rounded-lg p-2 text-white/55 hover:bg-white/10 hover:text-white"><Pencil size={15} /></button><button type="button" aria-label={`Delete ${category.name}`} onClick={(e) => { e.stopPropagation(); onDelete(category); }} className="rounded-lg p-2 text-white/55 hover:bg-coral/10 hover:text-coral"><Trash2 size={15} /></button></div></div>
      <h2 className="mt-5 truncate font-display text-lg font-semibold text-white">{category.name}</h2><p className="mt-1 text-sm text-white/45">{category.noteCount || 0} {(category.noteCount || 0) === 1 ? "note" : "notes"}</p>
    </motion.article>;
  })}</div>;
}
