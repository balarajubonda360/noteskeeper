import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext.jsx";
import * as noteService from "../services/noteService.js";

const confettiColors = ["#2FAF9A", "#FF9F86", "#FDF2F0"];
const NotesContext = createContext(null);

export function celebrateNoteRemoval(particleCount = 26) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  import("canvas-confetti")
    .then(({ default: confetti }) => confetti({
      particleCount,
      spread: 46,
      startVelocity: 22,
      ticks: 110,
      scalar: 0.72,
      origin: { x: 0.5, y: 0.72 },
      colors: confettiColors,
    }))
    .catch(() => {});
}

/** Share the current note page and optimistic note mutations across routes. */
export function NotesProvider({ children }) {
  const auth = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [query, setQuery] = useState({});
  const queryRef = useRef({});

  useEffect(() => {
    if (auth?.user) return;
    setNotes([]);
    setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
    setQuery({});
    setLoadError(null);
  }, [auth?.user?._id]);

  const fetchNotes = useCallback(async (params = {}, { append = false } = {}) => {
    setLoading(true);
    setLoadError(null);
    setQuery(params);
    if (!append && JSON.stringify(params) !== JSON.stringify(queryRef.current)) setNotes([]);
    queryRef.current = params;
    try {
      const response = params.q
        ? await noteService.searchNotes(params.q, params)
        : params.status || params.category || params.color || params.tag || params.from || params.to || params.sort
          ? await noteService.filterNotes(params)
          : await noteService.getNotes(params);
      const rows = response.data || [];
      setNotes((current) => append ? [...current, ...rows] : rows);
      setPagination(response.pagination || { page: 1, limit: 10, total: rows.length, totalPages: 1 });
      return rows;
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Couldn't load your notes.";
      setLoadError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (values) => {
    const tempId = `new-${Date.now()}`;
    const optimistic = {
      ...values,
      _id: tempId,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: values.category || null,
    };

    setNotes((current) => [optimistic, ...current]);
    setPagination((current) => ({ ...current, total: current.total + 1 }));

    try {
      const response = await noteService.createNote(values);
      const created = response.data;
      setNotes((current) => current.map((note) => note._id === tempId ? created : note));
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        import("canvas-confetti")
          .then(({ default: confetti }) => confetti({
            particleCount: 42,
            spread: 52,
            startVelocity: 26,
            ticks: 130,
            scalar: 0.82,
            origin: { x: 0.5, y: 0.72 },
            colors: confettiColors,
          }))
          .catch(() => {});
      }

      toast.success("Note created");
      return created;
    } catch (error) {
      setNotes((current) => current.filter((note) => note._id !== tempId));
      setPagination((current) => ({ ...current, total: Math.max(0, current.total - 1) }));
      toast.error(error.response?.data?.message || "Couldn't create this note.");
      return null;
    }
  }, []);

  const updateNote = useCallback(async (id, updates) => {
    const previousNote = notes.find((note) => note._id === id);
    setNotes((current) => current.map((note) => note._id === id ? { ...note, ...updates } : note));
    try {
      const response = await noteService.updateNote(id, updates);
      setNotes((current) => current.map((note) => note._id === id ? response.data : note));
      toast.success("Note updated");
      return response.data;
    } catch (error) {
      if (previousNote) {
        setNotes((current) => current.map((note) => note._id === id ? previousNote : note));
      }
      toast.error(error.response?.data?.message || "Couldn't update this note.");
      return null;
    }
  }, [notes]);

  const removeNote = useCallback(async (id, { quiet = false, celebrate = true } = {}) => {
    const previousNote = notes.find((note) => note._id === id);
    const previousIndex = notes.findIndex((note) => note._id === id);
    setNotes((current) => current.filter((note) => note._id !== id));
    setPagination((current) => ({ ...current, total: Math.max(0, current.total - 1) }));
    try {
      await noteService.deleteNote(id);
      if (celebrate) celebrateNoteRemoval();
      if (!quiet) toast.success("Note deleted");
      return true;
    } catch (error) {
      if (previousNote) {
        setNotes((current) => current.some((note) => note._id === id)
          ? current
          : [...current.slice(0, previousIndex), previousNote, ...current.slice(previousIndex)]);
      }
      setPagination((current) => ({ ...current, total: current.total + 1 }));
      toast.error(error.response?.data?.message || "Couldn't delete this note.");
      return false;
    }
  }, [notes]);

  const changeStatus = useCallback(async (id, status) => {
    const previousNote = notes.find((note) => note._id === id);
    const currentStatus = query.status;
    const removedFromView = (status === "trashed" && !currentStatus) || (currentStatus && currentStatus !== status);
    setNotes((current) => current.flatMap((note) => {
      if (note._id !== id) return [note];
      if (status === "trashed" && !currentStatus) return [];
      if (currentStatus && currentStatus !== status) return [];
      return [{ ...note, status }];
    }));
    if (removedFromView) {
      setPagination((current) => ({ ...current, total: Math.max(0, current.total - 1) }));
    }

    try {
      const response = await noteService.changeStatus(id, status);
      setNotes((current) => current.map((note) => note._id === id ? response.data : note));
      if (status === "trashed") celebrateNoteRemoval();
      toast.success(status === "pinned" ? "Note pinned" : `Note ${status}`);
      return response.data;
    } catch (error) {
      if (previousNote) {
        setNotes((current) => current.some((note) => note._id === id)
          ? current.map((note) => note._id === id ? previousNote : note)
          : [previousNote, ...current]);
      }
      if (removedFromView) setPagination((current) => ({ ...current, total: current.total + 1 }));
      toast.error(error.response?.data?.message || "Couldn't change this note.");
      return null;
    }
  }, [notes, query.status]);

  const value = useMemo(() => ({
    notes,
    pagination,
    loading,
    loadError,
    fetchNotes,
    createNote,
    updateNote,
    removeNote,
    changeStatus,
  }), [notes, pagination, loading, loadError, fetchNotes, createNote, updateNote, removeNote, changeStatus]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes must be used inside NotesProvider");
  return context;
}
