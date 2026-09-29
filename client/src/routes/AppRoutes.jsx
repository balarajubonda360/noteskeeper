import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Notes from "../pages/Notes.jsx";
import ArchivePage from "../pages/Archive.jsx";
import Trash from "../pages/Trash.jsx";
import Login from "../pages/Login.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import Register from "../pages/Register.jsx";
import Categories from "../pages/Categories.jsx";
import Admin from "../pages/Admin.jsx";
import Home from "../pages/Home.jsx";
import AccountAccess from "../pages/AccountAccess.jsx";
import PageTransition from "./PageTransition.jsx";
import { ProtectedRoute, PublicRoute } from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

/** Declare public and authenticated application pages. */
export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />

        <Route element={<PublicRoute />}>
          <Route path="/account" element={<PageTransition><AccountAccess /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/notes" element={<PageTransition><Notes /></PageTransition>} />
            <Route path="/archive" element={<PageTransition><ArchivePage /></PageTransition>} />
            <Route path="/trash" element={<PageTransition><Trash /></PageTransition>} />
            <Route path="/categories" element={<PageTransition><Categories /></PageTransition>} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
