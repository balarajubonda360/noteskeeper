import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

/** Access the authenticated account and session actions. */
export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
