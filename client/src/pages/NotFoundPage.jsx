import { Link } from "react-router-dom";
import AuroraBackground from "../components/layout/AuroraBackground.jsx";
import Logo from "../components/ui/Logo.jsx";

export default function NotFoundPage() {
  return (
    <main className="relative grid min-h-screen place-items-center px-5 py-12 text-center">
      <AuroraBackground />
      <section className="relative z-10">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <p className="font-display text-8xl font-bold text-violet/80">404</p>
        <h1 className="mt-3 font-display text-2xl font-semibold">This page wandered off.</h1>
        <p className="mt-2 text-sm text-white/50">The address may be old, or the note may have moved.</p>
        <Link to="/dashboard" className="mt-6 inline-flex rounded-xl bg-violet px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet/80">Back to Notes Keeper</Link>
      </section>
    </main>
  );
}
