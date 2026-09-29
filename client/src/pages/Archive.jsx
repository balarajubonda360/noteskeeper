import { useEffect, useState } from "react";
import { ArchiveRestore } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import NoteEditor from "../components/notes/NoteEditor.jsx";
import NoteGrid from "../components/notes/NoteGrid.jsx";
import { useNotes } from "../context/NotesContext.jsx";

export default function ArchivePage() {
  const { notes, pagination, loading, loadError, fetchNotes, updateNote, changeStatus } = useNotes();
  const [selectedNote, setSelectedNote] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => { fetchNotes({ status: "archived", page: 1, limit: 12 }); }, [fetchNotes]);

  const edit = (note) => { setSelectedNote(note); setEditorOpen(true); };
  const closeEditor = () => { setEditorOpen(false); setSelectedNote(null); };

  return (
    <div className="space-y-6 pb-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-mint">Tucked away</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white/95">Archive</h1>
        <p className="mt-1 text-sm text-white/45">Notes you may want to revisit someday.</p>
      </header>
      {loading && notes.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-64 rounded-2xl" />)}
        </div>
      ) : loadError ? (
        <section role="alert" className="glass space-y-3 rounded-2xl p-6"><p className="text-sm text-coral">{loadError}</p><Button variant="ghost" onClick={() => fetchNotes({ status: "archived", page: 1, limit: 12 })}>Try again</Button></section>
      ) : notes.length ? (
        <>
          <NoteGrid notes={notes} view="archive" onEdit={edit} onChangeStatus={changeStatus} />
          {pagination.page < pagination.totalPages && <div className="flex justify-center"><Button variant="ghost" loading={loading} onClick={() => fetchNotes({ status: "archived", page: pagination.page + 1, limit: pagination.limit }, { append: true })}>Load more</Button></div>}
        </>
      ) : (
        <section className="glass rounded-2xl p-4 sm:p-8">
          <EmptyState icon={<ArchiveRestore size={24} />} title="Nothing in the archive" description="Archived notes will wait here until you bring them back." />
        </section>
      )}
      <NoteEditor open={editorOpen} note={selectedNote} onClose={closeEditor} onSave={(values) => updateNote(selectedNote._id, values)} />
    </div>
  );
}
