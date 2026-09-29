import { NotebookPen } from "lucide-react";

/** Friendly blank-state treatment with an optional action. */
export default function EmptyState({
  icon = <NotebookPen size={25} />,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center px-5 py-8 text-center">
      <div className="mb-5 grid h-16 w-16 animate-float place-items-center rounded-2xl border border-violet/25 bg-violet/10 text-mint shadow-lg shadow-violet/10">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-white/90">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm leading-6 text-white/50">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
