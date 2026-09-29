import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster, ToastBar } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotesProvider } from "./context/NotesContext.jsx";
import ErrorBoundary from "./components/ui/ErrorBoundary.jsx";
import App from "./App.jsx";
import "./styles/index.css";
import "./styles/animations.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <NotesProvider>
            <App />
            <Toaster position="top-right" toastOptions={{ duration: 4000, success: { iconTheme: { primary: "#2FAF9A", secondary: "#1B3A3C" } }, error: { iconTheme: { primary: "#FF9F86", secondary: "#1B3A3C" } } }}>
              {(toast) => <div className={`toast-enter toast-glass ${toast.type === "success" ? "toast-success" : toast.type === "error" ? "toast-error" : ""}`}><ToastBar toast={toast} style={{ background: "transparent", border: "0", boxShadow: "none", color: "inherit" }} /></div>}
            </Toaster>
          </NotesProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
