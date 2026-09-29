import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import NoteEditor from "../components/notes/NoteEditor.jsx";
import NoteGrid from "../components/notes/NoteGrid.jsx";
import NoteFilters from "../components/notes/NoteFilters.jsx";
import { useNotes } from "../context/NotesContext.jsx";
import { getCategories } from "../services/categoryService.js";

const pageSize = 12;

function NotesSkeleton() {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    {Array.from({ length: 8 }, (_, index) => (
      <div key={index} className="glass h-64 space-y-4 rounded-2xl p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>;
}

export default function Notes() {
  const { notes, pagination, loading, loadError, fetchNotes, createNote, updateNote, changeStatus } = useNotes();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
  const search = params.q?.trim() || "";
  const page = Math.max(1, Number(params.page) || 1);
  const [categories, setCategories] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => { getCategories({ page: 1, limit: 50 }).then((result) => setCategories(result.data || [])).catch(() => setCategories([])); }, []);
  const requestParams = useMemo(() => {
    const filters = Object.fromEntries(Object.entries(params).filter(([key, value]) => !["q", "page", "limit"].includes(key) && value));
    return { ...filters, ...(search ? { q: search } : {}), page, limit: pageSize };
  }, [params, page, search]);
  useEffect(() => { fetchNotes(requestParams); }, [fetchNotes, location.search, requestParams]);
  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete("page"); setSearchParams(next);
  };
  const clearFilters = () => { const next = new URLSearchParams(); if (search) next.set("q", search); setSearchParams(next); };

  const edit = (note) => {
    setSelectedNote(note);
    setEditorOpen(true);
  };
  const newNote = () => {
    setSelectedNote(null);
    setEditorOpen(true);
  };
  const closeEditor = () => {
    setEditorOpen(false);
    setSelectedNote(null);
  };
  const saveNote = (values) => selectedNote
    ? updateNote(selectedNote._id, values)
    : createNote(values);
  const goToPage = (nextPage) => { const next = new URLSearchParams(searchParams); if (nextPage > 1) next.set("page", String(nextPage)); else next.delete("page"); setSearchParams(next); };

  return (
    <div className="space-y-6 pb-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-mint">Your collection</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white/95">{search ? "Search notes" : "All notes"}</h1>
          <p className="mt-1 text-sm text-white/45">{search ? `Results for “${search}”` : "Keep the thoughts you want to find again."}</p>
        </div>
        <Button onClick={newNote}><Plus size={17} /> New Note</Button>
      </header>

      <NoteFilters params={params} categories={categories} onChange={updateFilter} onClear={clearFilters} />

      {loading && notes.length === 0 ? (
        <NotesSkeleton />
      ) : loadError ? (
        <section role="alert" className="glass space-y-3 rounded-2xl p-6"><p className="text-sm text-coral">{loadError}</p><Button variant="ghost" onClick={() => fetchNotes(requestParams)}>Try again</Button></section>
      ) : notes.length === 0 ? (
        <section className="glass rounded-2xl p-4 sm:p-8">
          <EmptyState
            icon={<Plus size={24} />}
            title={search ? "No notes found" : "Your first note starts here"}
            description={search ? "Try another word, or create a new note instead." : "Capture a thought now and keep it close for later."}
            action={<Button onClick={newNote}><Plus size={16} /> Write your first note</Button>}
          />
        </section>
      ) : (
        <>
          <NoteGrid notes={notes} onEdit={edit} onChangeStatus={changeStatus} />
          {pagination.totalPages > 1 && <div className="flex items-center justify-center gap-4 pt-2"><Button variant="ghost" disabled={page <= 1 || loading} onClick={() => goToPage(page - 1)}>Previous</Button><span className="text-xs text-white/45">Page {page} of {pagination.totalPages}</span><Button variant="ghost" disabled={page >= pagination.totalPages || loading} onClick={() => goToPage(page + 1)}>Next</Button></div>}
        </>
      )}

      <NoteEditor open={editorOpen} note={selectedNote} onClose={closeEditor} onSave={saveNote} />
    </div>
  );
}
