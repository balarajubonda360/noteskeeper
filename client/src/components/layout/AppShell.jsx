import { useEffect, useRef, useState } from "react";
import { Archive, LayoutDashboard, LogOut, NotebookPen, Search, Tags, Trash2, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import AuroraBackground from "./AuroraBackground.jsx";
import useAuth from "../../hooks/useAuth.js";
import useDebounce from "../../hooks/useDebounce.js";
import { searchNotes } from "../../services/noteService.js";
import { useNotes } from "../../context/NotesContext.jsx";
import CountUp from "../ui/CountUp.jsx";
import Logo from "../ui/Logo.jsx";

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "All Notes", path: "/notes", icon: NotebookPen },
  { label: "Categories", path: "/categories", icon: Tags },
  { label: "Archive", path: "/archive", icon: Archive },
  { label: "Trash", path: "/trash", icon: Trash2 },
];

function SidebarLinks({ mobile = false }) {
  const { pagination } = useNotes();
  const reduceMotion = useReducedMotion();
  return navigation.map(({ label, path, icon: Icon }) => (
    <NavLink
      key={path}
      to={path}
      end={path === "/dashboard"}
      aria-label={label}
      className={({ isActive }) => `relative flex items-center ${mobile ? "min-w-0 flex-1 flex-col gap-1 px-1 py-2 text-[10px]" : "gap-3 rounded-xl px-3 py-2.5 text-sm"} ${isActive ? "text-white" : "text-white/50 transition hover:bg-white/5 hover:text-white/85"}`}
    >
      {({ isActive }) => (
        <>
          {isActive && <motion.span layoutId={reduceMotion ? undefined : mobile ? "mobile-nav-active" : "desktop-nav-active"} className={`absolute rounded-xl bg-violet/15 ${mobile ? "inset-0" : "inset-0"}`} transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
          <Icon size={mobile ? 19 : 18} className={`relative z-[1] ${isActive ? "text-cyber" : ""}`} />
          <span className="relative z-[1] truncate">{label}</span>
          {path === "/notes" && pagination.total > 0 && <CountUp value={pagination.total} aria-label={`${pagination.total} notes`} className={`z-[1] rounded-full bg-white/10 px-1.5 py-0.5 tabular-nums ${mobile ? "absolute right-1 top-0 text-[8px]" : "relative ml-auto text-[10px]"}`} />}
        </>
      )}
    </NavLink>
  ));
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState(new URLSearchParams(location.search).get("q") || "");
  const debouncedSearch = useDebounce(search, 400);
  const [results, setResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(-1);
  const searchBox = useRef(null);
  useEffect(() => { setSearch(new URLSearchParams(location.search).get("q") || ""); }, [location.search]);

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(search.trim() ? `/notes?q=${encodeURIComponent(search.trim())}` : "/notes");
    setSearchOpen(false);
  };

  useEffect(() => {
    if (!debouncedSearch.trim()) { setResults([]); return undefined; }
    let active = true;
    searchNotes(debouncedSearch.trim(), { page: 1, limit: 6 })
      .then((response) => { if (active) setResults(response.data || []); })
      .catch(() => { if (active) setResults([]); });
    return () => { active = false; };
  }, [debouncedSearch]);
  useEffect(() => {
    const close = (event) => { if (!searchBox.current?.contains(event.target)) setSearchOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const highlight = (value) => {
    const term = debouncedSearch.trim();
    if (!term || !value) return value;
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return String(value).split(new RegExp(`(${escaped})`, "ig")).map((part, index) => part.toLowerCase() === term.toLowerCase() ? <mark key={index} className="rounded bg-cyber/25 text-cyber">{part}</mark> : part);
  };
  const onSearchKeyDown = (event) => {
    if (event.key === "ArrowDown" && searchOpen) { event.preventDefault(); setActiveResult((i) => Math.min(i + 1, results.length)); }
    if (event.key === "ArrowUp" && searchOpen) { event.preventDefault(); setActiveResult((i) => Math.max(i - 1, -1)); }
    if (event.key === "Escape") setSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="relative z-20 border-b border-white/10 bg-ink backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <NavLink to="/" aria-label="Notes Keeper home" className="shrink-0 whitespace-nowrap">
          <Logo size={location.pathname === "/dashboard" ? "dashboard" : "default"} />
        </NavLink>
        <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <NavLink to="/" end className={({ isActive }) => `rounded-lg px-2 py-2 text-xs transition sm:px-3 sm:text-sm ${isActive ? "bg-white/10 text-cyber" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>Home</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `rounded-lg px-2 py-2 text-xs transition sm:px-3 sm:text-sm ${isActive ? "bg-white/10 text-cyber" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>Dashboard</NavLink>
          {user?.role === "admin" && <NavLink to="/admin" className={({ isActive }) => `flex items-center gap-1 rounded-lg px-2 py-2 text-xs transition sm:px-3 sm:text-sm ${isActive ? "bg-white/10 text-cyber" : "text-white/60 hover:bg-white/5 hover:text-white"}`}><ShieldCheck size={15} /> Admin</NavLink>}
          <button type="button" onClick={handleLogout} className="flex items-center gap-1 rounded-lg px-2 py-2 text-xs text-white/60 transition hover:bg-white/5 hover:text-white sm:gap-2 sm:px-3 sm:text-sm"><LogOut size={15} /> Sign out</button>
        </nav>
        <form ref={searchBox} onSubmit={submitSearch} className="relative ml-auto flex h-10 w-full min-w-0 max-w-md items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 focus-within:border-violet/50">
          <Search size={17} className="shrink-0 text-white/40" />
          <input
            value={search}
            onChange={(event) => { setSearch(event.target.value); setSearchOpen(true); setActiveResult(-1); }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={onSearchKeyDown}
            aria-label="Search notes"
            placeholder="Search your notes..."
            className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />
          <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/30 sm:block">↵</kbd>
          {searchOpen && search.trim() && <div role="listbox" aria-label="Search results" className="glass absolute left-0 right-0 top-12 z-40 max-h-96 overflow-y-auto rounded-xl p-2 shadow-2xl">
            {results.length ? <>{results.map((note, index) => <button key={note._id} type="button" role="option" aria-selected={activeResult === index} onMouseEnter={() => setActiveResult(index)} onClick={() => { navigate(`/notes?q=${encodeURIComponent(search.trim())}`); setSearchOpen(false); }} className={`block w-full rounded-lg px-3 py-2 text-left ${activeResult === index ? "bg-cyber/10" : "hover:bg-white/5"}`}><span className="block truncate text-sm font-medium text-white/85">{highlight(note.title)}</span><span className="mt-0.5 block truncate text-xs text-white/40">{highlight(note.content?.slice(0, 100))}</span></button>)}<button type="button" role="option" aria-selected={activeResult === results.length} onClick={() => { navigate(`/notes?q=${encodeURIComponent(search.trim())}`); setSearchOpen(false); }} className={`w-full rounded-lg px-3 py-2 text-left text-xs text-cyber ${activeResult === results.length ? "bg-cyber/10" : "hover:bg-white/5"}`}>See all results</button></> : <p className="px-3 py-4 text-center text-sm text-white/45">No results</p>}
          </div>}
        </form>
      </div>
    </header>
  );
}

/** Shared authenticated layout with desktop sidebar and mobile bottom navigation. */
export default function AppShell() {
  return (
    <div className="relative min-h-screen bg-ink">
      <AuroraBackground />
      <div className="relative z-10">
        <Navbar />
        <div className="mx-auto flex max-w-[1440px] gap-6 px-4 pb-24 pt-6 sm:px-6 lg:gap-10 lg:px-8 lg:pb-10">
          <aside className="glass sticky top-6 hidden h-fit w-60 shrink-0 rounded-2xl p-3 lg:block">
            <p className="mb-3 px-3 pt-2 text-[10px] font-semibold uppercase tracking-[.2em] text-white/30">Workspace</p>
            <nav className="space-y-1"><SidebarLinks /></nav>
          </aside>
          <main className="min-w-0 flex-1"><Outlet /></main>
        </div>
        <nav aria-label="Mobile navigation" className="glass fixed inset-x-3 bottom-3 z-30 flex rounded-2xl p-1.5 lg:hidden">
          <SidebarLinks mobile />
        </nav>
      </div>
    </div>
  );
}
