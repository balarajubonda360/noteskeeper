import { useCallback, useEffect, useRef, useState } from "react";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import Modal from "../ui/Modal.jsx";
import ColorPicker from "./ColorPicker.jsx";
import CategoryForm from "../categories/CategoryForm.jsx";
import { createCategory, getCategories } from "../../services/categoryService.js";
import toast from "react-hot-toast";

const emptyNote = { title: "", content: "", tags: [], category: "", color: "navy" };

/** Create or edit a note in the shared-layout modal editor. */
export default function NoteEditor({ open, note = null, onClose, onSave }) {
  const [values, setValues] = useState(emptyNote);
  const [tagValue, setTagValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const textareaRef = useRef(null);
  const formRef = useRef(null);
  const editing = Boolean(note);

  useEffect(() => {
    if (!open) return;
    const category = typeof note?.category === "object" ? note.category?._id : note?.category;
    setValues(note ? {
      title: note.title || "",
      content: note.content || "",
      tags: note.tags || [],
      category: category || "",
      color: note.color || "navy",
    } : emptyNote);
    setTagValue("");
    setErrors({});
  }, [open, note]);

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    getCategories({ page: 1, limit: 50 })
      .then((response) => { if (active) setCategories(response.data || []); })
      .catch(() => { if (active) setCategories([]); });
    return () => { active = false; };
  }, [open]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [values.content, open]);

  const save = useCallback(() => {
    formRef.current?.requestSubmit();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, [open, save]);

  const setField = (field, value) => setValues((current) => ({ ...current, [field]: value }));

  const addTag = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const tag = tagValue.trim().toLowerCase();
    if (!tag) return;
    if (values.tags.length >= 8) {
      setErrors((current) => ({ ...current, tags: "You can add up to 8 tags." }));
      return;
    }
    if (values.tags.includes(tag)) {
      setTagValue("");
      return;
    }
    setValues((current) => ({ ...current, tags: [...current.tags, tag] }));
    setTagValue("");
    setErrors((current) => ({ ...current, tags: "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.title.trim()) nextErrors.title = "A title is required.";
    if (values.title.trim().length > 100) nextErrors.title = "Title must be 100 characters or fewer.";
    if (!values.content.trim()) nextErrors.content = "Write a little something in your note.";
    if (values.content.length > 10000) nextErrors.content = "Content must be 10,000 characters or fewer.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    const saved = await onSave({
      title: values.title.trim(),
      content: values.content,
      tags: values.tags,
      category: values.category || null,
      color: values.color,
    });
    setSaving(false);
    if (saved) onClose();
  };

  const removeTag = (tagToRemove) => {
    setValues((current) => ({ ...current, tags: current.tags.filter((tag) => tag !== tagToRemove) }));
    setErrors((current) => ({ ...current, tags: "" }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit your note" : "A thought worth keeping"}
      layoutId={note ? `note-card-${note._id}` : undefined}
    >
      <form ref={formRef} onSubmit={submit} className="max-h-[75vh] space-y-4 overflow-y-auto pr-1">
        <Input
          id="note-editor-title"
          label="Title"
          maxLength={100}
          value={values.title}
          onChange={(event) => setField("title", event.target.value)}
          error={errors.title}
        />
        <div className="space-y-1.5">
          <label htmlFor="note-editor-content" className="text-xs font-medium text-white/60">Your note</label>
          <div className="animated-gradient-border rounded-xl">
            <textarea
              ref={textareaRef}
              id="note-editor-content"
              value={values.content}
              maxLength={10000}
              onChange={(event) => setField("content", event.target.value)}
              placeholder="Start writing..."
              rows={5}
              className="block max-h-64 min-h-32 w-full resize-none rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm leading-6 text-white/85 outline-none placeholder:text-white/30 focus:border-transparent"
            />
          </div>
          <div className="flex items-start justify-between gap-3">
            {errors.content ? <p role="alert" className="text-xs text-coral">{errors.content}</p> : <span />}
            <span className="shrink-0 text-[10px] tabular-nums text-white/35">{values.content.length.toLocaleString()} / 10,000</span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="note-editor-tag" className="text-xs font-medium text-white/60">Tags <span className="text-white/30">· up to 8</span></label>
          <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-ink/70 px-3 py-2 focus-within:border-violet/50">
            {values.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-violet/25 bg-violet/10 px-2 py-1 text-xs text-white/80">
                #{tag}
                <button type="button" aria-label={`Remove ${tag} tag`} onClick={() => removeTag(tag)} className="text-white/45 hover:text-white">×</button>
              </span>
            ))}
            {values.tags.length < 8 && (
              <input
                id="note-editor-tag"
                value={tagValue}
                maxLength={30}
                onChange={(event) => setTagValue(event.target.value)}
                onKeyDown={addTag}
                placeholder="Type a tag and press Enter"
                className="min-w-36 flex-1 bg-transparent py-1 text-xs text-white outline-none placeholder:text-white/30"
              />
            )}
          </div>
          {errors.tags && <p role="alert" className="text-xs text-coral">{errors.tags}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between"><label htmlFor="note-editor-category" className="text-xs font-medium text-white/60">Category</label><button type="button" onClick={() => setCategoryFormOpen(true)} className="text-xs text-mint hover:text-white">+ New</button></div>
            <select
              id="note-editor-category"
              value={values.category}
              onChange={(event) => setField("category", event.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-ink px-3 text-sm text-white/80 outline-none focus:border-violet/50"
            >
              <option value="">No category</option>
              {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <span className="block text-xs font-medium text-white/60">Color</span>
            <ColorPicker value={values.color} onChange={(color) => setField("color", color)} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span className="text-[10px] text-white/35"><kbd className="rounded border border-white/10 px-1 py-0.5">Ctrl</kbd> + <kbd className="rounded border border-white/10 px-1 py-0.5">Enter</kbd> to save</span>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? "Save changes" : "Save note"}</Button>
          </div>
        </div>
      </form>
      <CategoryForm open={categoryFormOpen} category={null} onClose={() => setCategoryFormOpen(false)} onSave={async (category) => {
        try { const result = await createCategory(category); const created = result.data; setCategories((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name))); setField("category", created._id); toast.success("Category created"); return created; }
        catch (error) { toast.error(error.response?.data?.message || "Could not create category."); return null; }
      }} />
    </Modal>
  );
}
