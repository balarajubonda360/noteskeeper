import { Tags } from "lucide-react";
import { useLocation } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState.jsx";

const pages = {
  categories: { title: "Categories", subtitle: "Keep related thoughts together.", icon: Tags },
};

/** Small route landing pages; note and category views are filled in later phases. */
export default function WorkspacePage({ page }) {
  const config = pages[page];
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("q");
  const Icon = config.icon;

  return (
    <section className="glass min-h-[min(70vh,700px)] rounded-3xl p-6 sm:p-9">
      <div className="mb-10">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-mint">
          <Icon size={15} /> Notes Keeper workspace
        </p>
        <h1 className="font-display text-3xl font-semibold text-white/95 sm:text-4xl">{config.title}</h1>
        <p className="mt-2 text-sm text-white/50">{search ? `Search for “${search}”` : config.subtitle}</p>
      </div>
      <EmptyState
        icon={<Icon size={24} />}
        title={search ? "Search is ready for your notes" : "Your workspace is ready"}
        description={search ? "The notes search view will appear here as note browsing is added." : "Your notes and categories will appear here as you add them."}
      />
    </section>
  );
}
