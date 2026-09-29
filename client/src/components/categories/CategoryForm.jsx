import { useEffect, useState } from "react";
import { Folder, BookOpen, BriefcaseBusiness, Code2, Heart, Lightbulb, Plane, ShoppingBag, Star, Target, Users, Wallet } from "lucide-react";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import Modal from "../ui/Modal.jsx";
import { notePalette } from "../notes/ColorPicker.jsx";

const iconOptions = ["Folder", "BookOpen", "BriefcaseBusiness", "Code2", "Heart", "Lightbulb", "Plane", "ShoppingBag", "Star", "Target", "Users", "Wallet"];
const iconComponents = [Folder, BookOpen, BriefcaseBusiness, Code2, Heart, Lightbulb, Plane, ShoppingBag, Star, Target, Users, Wallet];

export default function CategoryForm({ open, category, onClose, onSave }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("violet");
  const [icon, setIcon] = useState("Folder");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!open) return;
    setName(category?.name || ""); setColor(category?.color || "violet"); setIcon(category?.icon || "Folder"); setError("");
  }, [open, category]);
  const submit = async (event) => {
    event.preventDefault();
    if (!name.trim()) { setError("Enter a category name."); return; }
    setSaving(true);
    const result = await onSave({ name: name.trim(), color, icon });
    setSaving(false);
    if (result) onClose();
    else setError("Could not save this category. Check that its name is unique.");
  };
  return <Modal open={open} onClose={onClose} title={category ? "Edit category" : "New category"}>
    <form onSubmit={submit} className="space-y-5">
      <Input id="category-name" label="Name" maxLength={30} value={name} onChange={(e) => setName(e.target.value)} error={error} />
      <div className="space-y-2"><span className="text-xs font-medium text-white/60">Color</span>
        <div className="flex gap-3" role="radiogroup" aria-label="Category color">{Object.entries(notePalette).map(([key, value]) => <button key={key} type="button" role="radio" aria-checked={color === key} aria-label={key} onClick={() => setColor(key)} className={`h-8 w-8 rounded-full ${color === key ? "ring-2 ring-white ring-offset-2 ring-offset-ink" : ""}`} style={{ backgroundColor: value }} />)}</div>
      </div>
      <div className="space-y-2"><span className="text-xs font-medium text-white/60">Icon</span><div className="grid grid-cols-6 gap-2">{iconOptions.map((key, i) => { const Icon = iconComponents[i]; return <button key={key} type="button" aria-label={key} aria-pressed={icon === key} onClick={() => setIcon(key)} className={`grid h-11 place-items-center rounded-xl border ${icon === key ? "border-mint bg-mint/10 text-mint" : "border-white/10 text-white/55 hover:bg-white/5"}`}><Icon size={18} /></button>; })}</div></div>
      <div className="flex justify-end gap-2 border-t border-white/10 pt-4"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" loading={saving}>{category ? "Save changes" : "Create category"}</Button></div>
    </form>
  </Modal>;
}
