import { useEffect, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Modal from "../components/ui/Modal.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import NoteGrid from "../components/notes/NoteGrid.jsx";
import { useNotes, celebrateNoteRemoval } from "../context/NotesContext.jsx";
import { filterNotes } from "../services/noteService.js";

export default function Trash() {
  const { notes, pagination, loading, loadError, fetchNotes, removeNote, changeStatus } = useNotes();
  const [confirmNote, setConfirmNote] = useState(null);
  const [confirmEmpty, setConfirmEmpty] = useState(false);
  const [emptying, setEmptying] = useState(false);

  useEffect(() => { fetchNotes({ status: "trashed", page: 1, limit: 12 }); }, [fetchNotes]);

  const deleteForever = async () => {
    if (!confirmNote) return;
    const wasRemoved = await removeNote(confirmNote._id);
    if (wasRemoved) setConfirmNote(null);
  };

  const emptyTrash = async () => {
    setEmptying(true);
    let removedCount = 0;
    try {
      while (true) {
        const response = await filterNotes({ status: "trashed", page: 1, limit: 50 });
        const batch = response.data || [];
        if (batch.length === 0) break;
        let allRemoved = true;
        for (const note of batch) {
          const removed = await removeNote(note._id, { quiet: true, celebrate: false });
          if (!removed) {
            allRemoved = false;
            await fetchNotes({ status: "trashed", page: 1, limit: 12 });
            break;
          }
          removedCount += 1;
        }
        if (!allRemoved) return;
      }
      setConfirmEmpty(false);
      if (removedCount) {
        celebrateNoteRemoval(42);
        toast.success("Trash emptied");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Couldn't empty the trash.");
    } finally {
      setEmptying(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-coral">Last stop</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white/95">Trash</h1>
          <p className="mt-1 text-sm text-white/45">Restore a note or permanently remove it.</p>
        </div>
        {notes.length > 0 && <Button variant="danger" onClick={() => setConfirmEmpty(true)}><Trash2 size={16} /> Empty trash</Button>}
      </header>

      {loading && notes.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-64 rounded-2xl" />)}
        </div>
      ) : loadError ? (
        <section role="alert" className="glass space-y-3 rounded-2xl p-6"><p className="text-sm text-coral">{loadError}</p><Button variant="ghost" onClick={() => fetchNotes({ status: "trashed", page: 1, limit: 12 })}>Try again</Button></section>
      ) : notes.length ? (
        <>
          <NoteGrid notes={notes} view="trash" onChangeStatus={changeStatus} onDeleteForever={setConfirmNote} />
          {pagination.page < pagination.totalPages && <div className="flex justify-center"><Button variant="ghost" loading={loading} onClick={() => fetchNotes({ status: "trashed", page: pagination.page + 1, limit: pagination.limit }, { append: true })}>Load more</Button></div>}
        </>
      ) : (
        <section className="glass rounded-2xl p-4 sm:p-8">
          <EmptyState icon={<RotateCcw size={24} />} title="Your trash is empty" description="Notes you move to trash will appear here. You can restore them or delete them forever." />
        </section>
      )}

      <Modal open={Boolean(confirmNote)} onClose={() => setConfirmNote(null)} title="Delete this note forever?">
        <p className="text-sm leading-6 text-white/60">“{confirmNote?.title}” will be permanently deleted and cannot be restored.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmNote(null)}>Cancel</Button>
          <Button variant="danger" onClick={deleteForever}><Trash2 size={15} /> Delete forever</Button>
        </div>
      </Modal>

      <Modal open={confirmEmpty} onClose={() => { if (!emptying) setConfirmEmpty(false); }} title="Empty the trash?">
        <p className="text-sm leading-6 text-white/60">Every trashed note will be permanently deleted. This cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" disabled={emptying} onClick={() => setConfirmEmpty(false)}>Cancel</Button>
          <Button variant="danger" loading={emptying} onClick={emptyTrash}><Trash2 size={15} /> Empty trash</Button>
        </div>
      </Modal>
    </div>
  );
}
