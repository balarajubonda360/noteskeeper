import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, Users, NotebookPen, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import { deleteAdminNote, getAdminNotes, getAdminUsers, updateUserAccess, updateUserRole } from "../services/adminService.js";
import useAuth from "../hooks/useAuth.js";

const card = "glass overflow-hidden rounded-2xl";
const cell = "px-4 py-3 text-sm";

function Pager({ page, pagination, setPage }) {
  if ((pagination?.totalPages || 1) < 2) return null;
  return <div className="flex items-center justify-between border-t border-white/10 px-4 py-3"><span className="text-xs text-white/45">Page {page} of {pagination.totalPages}</span><div className="flex gap-2"><Button variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={15} /> Previous</Button><Button variant="ghost" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>Next <ChevronRight size={15} /></Button></div></div>;
}

export default function Admin() {
  const { user } = useAuth();
  const [section, setSection] = useState("users");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = section === "users" ? await getAdminUsers({ page, limit: 10 }) : await getAdminNotes({ page, limit: 10 });
      setRows(result.data || []);
      setPagination(result.pagination || { totalPages: 1 });
    } catch (error) { toast.error(error.response?.data?.message || "Could not load admin data."); }
    finally { setLoading(false); }
  }, [section, page]);
  useEffect(() => { load(); }, [load]);
  const changeSection = (value) => { setSection(value); setPage(1); };
  const setRole = async (target, role) => {
    try { await updateUserRole(target._id, role); toast.success(`${target.name}'s role updated`); await load(); }
    catch (error) { toast.error(error.response?.data?.message || "Could not update role."); }
  };
  const setAccess = async (target, active) => {
    try { await updateUserAccess(target._id, active); toast.success(active ? `${target.name}'s access restored` : `${target.name}'s account suspended`); await load(); }
    catch (error) { toast.error(error.response?.data?.message || "Could not update account access."); }
  };
  const removeNote = async (note) => {
    if (!window.confirm(`Permanently delete “${note.title}” by ${note.user?.name || "unknown user"}?`)) return;
    try { await deleteAdminNote(note._id); toast.success("Note permanently deleted"); await load(); }
    catch (error) { toast.error(error.response?.data?.message || "Could not delete note."); }
  };

  return <div className="space-y-7 pb-16">
    <header><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-mint"><ShieldCheck size={15} /> Administration</p><h1 className="mt-2 font-display text-3xl font-semibold text-white/95">Admin</h1><p className="mt-1 text-sm text-white/45">Signed in as {user?.email}</p></header>
    <div className="flex gap-2"><Button variant={section === "users" ? "primary" : "ghost"} onClick={() => changeSection("users")}><Users size={16} /> Users</Button><Button variant={section === "notes" ? "primary" : "ghost"} onClick={() => changeSection("notes")}><NotebookPen size={16} /> All notes</Button></div>
    <section className={card}>
      <div className="border-b border-white/10 px-4 py-4"><h2 className="font-semibold text-white">{section === "users" ? "User accounts" : "Notes across all accounts"}</h2><p className="mt-1 text-xs text-white/40">{section === "users" ? "Change account roles. Your own admin role is protected." : "Deleting a note permanently removes it from its owner's account."}</p></div>
      {loading ? <div className="space-y-3 p-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div> : <div className="overflow-x-auto"><table className="w-full text-left"><thead className="text-[10px] uppercase tracking-wider text-white/40"><tr>{section === "users" ? <><th className={cell}>Name</th><th className={cell}>Email</th><th className={cell}>Role</th><th className={cell}>Access</th><th className={cell}>Controls</th></> : <><th className={cell}>Note</th><th className={cell}>Owner</th><th className={cell}>Updated</th><th className={cell}>Action</th></>}</tr></thead><tbody className="divide-y divide-white/5 text-white/80">{rows.map((row) => section === "users" ? <tr key={row._id}><td className={cell}>{row.name}</td><td className={`${cell} text-white/55`}>{row.email}</td><td className={cell}><span className="rounded-full bg-violet/20 px-2 py-1 text-xs">{row.role}</span></td><td className={cell}><span className={`rounded-full px-2 py-1 text-xs ${row.active === false ? "bg-coral/15 text-coral" : "bg-mint/10 text-mint"}`}>{row.active === false ? "Suspended" : "Active"}</span></td><td className={cell}>{row._id !== user?._id && <div className="flex flex-wrap gap-2"><Button variant="ghost" onClick={() => setRole(row, row.role === "admin" ? "user" : "admin")}>{row.role === "admin" ? "Remove admin" : "Make admin"}</Button><Button variant={row.active === false ? "primary" : "danger"} onClick={() => setAccess(row, row.active === false)}>{row.active === false ? "Restore access" : "Suspend"}</Button></div>}</td></tr> : <tr key={row._id}><td className={cell}><span className="block max-w-xs truncate font-medium">{row.title}</span><span className="block max-w-xs truncate text-xs text-white/40">{row.content}</span></td><td className={`${cell} text-white/55`}>{row.user?.name || "Deleted user"}<span className="block text-xs">{row.user?.email}</span></td><td className={`${cell} text-white/50`}>{new Date(row.updatedAt).toLocaleDateString()}</td><td className={cell}><Button variant="ghost" aria-label={`Delete ${row.title}`} onClick={() => removeNote(row)}><Trash2 size={15} /> Delete</Button></td></tr>)}</tbody></table>{rows.length === 0 && <p className="p-8 text-center text-sm text-white/40">No {section} found.</p>}</div>}
      {!loading && <Pager page={page} pagination={pagination} setPage={setPage} />}
    </section>
  </div>;
}
