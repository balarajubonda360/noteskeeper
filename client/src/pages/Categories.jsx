import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Tags } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button.jsx";
import CategoryForm from "../components/categories/CategoryForm.jsx";
import CategoryList from "../components/categories/CategoryList.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../services/categoryService.js";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const load = useCallback(async (requestedPage = page) => {
    setLoading(true);
    try { const result = await getCategories({ page: requestedPage, limit: 12 }); setCategories(result.data || []); setPagination(result.pagination || { page: 1, totalPages: 1 }); setLoadError(""); return result; }
    catch (error) { const message = error.response?.data?.message || "Could not load categories."; setLoadError(message); toast.error(message); return null; }
    finally { setLoading(false); }
  }, [page]);
  useEffect(() => { load(); }, [load]);
  const save = async (values) => {
    try {
      if (editing) await updateCategory(editing._id, values); else await createCategory(values);
      toast.success(editing ? "Category updated" : "Category created");
      if (!editing && page !== 1) { setPage(1); await load(1); } else await load(page);
      return true;
    } catch (error) { toast.error(error.response?.data?.message || "Could not save category."); return false; }
  };
  const remove = async (category) => {
    if (!window.confirm(`Delete “${category.name}”? Its notes will become uncategorized.`)) return;
    try {
      await deleteCategory(category._id);
      toast.success("Category deleted; its notes are now uncategorized.");
      const result = await load(page);
      const lastPage = result?.pagination?.totalPages || 1;
      if (page > lastPage) { setPage(lastPage); await load(lastPage); }
    }
    catch (error) { toast.error(error.response?.data?.message || "Could not delete category."); }
  };
  const create = () => { setEditing(null); setOpen(true); };
  const edit = (category) => { setEditing(category); setOpen(true); };
  return <div className="space-y-7 pb-16">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-mint"><Tags size={15} /> Your workspace</p><h1 className="mt-2 font-display text-3xl font-semibold text-white/95">Categories</h1><p className="mt-1 text-sm text-white/45">Keep related thoughts together.</p></div><Button onClick={create}><Plus size={17} /> New category</Button></header>
    {loading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-44 rounded-2xl" />)}</div> : loadError ? <section role="alert" className="glass space-y-3 rounded-2xl p-6"><p className="text-sm text-coral">{loadError}</p><Button variant="ghost" onClick={() => load(page)}>Try again</Button></section> : <><CategoryList categories={categories} onCreate={create} onEdit={edit} onDelete={remove} />{pagination.totalPages > 1 && <div className="flex items-center justify-center gap-4"><Button variant="ghost" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)}><ChevronLeft size={16} /> Previous</Button><span className="text-xs text-white/60">Page {page} of {pagination.totalPages}</span><Button variant="ghost" disabled={page >= pagination.totalPages || loading} onClick={() => setPage((current) => current + 1)}>Next <ChevronRight size={16} /></Button></div>}</>}
    <CategoryForm open={open} category={editing} onClose={() => setOpen(false)} onSave={save} />
  </div>;
}
