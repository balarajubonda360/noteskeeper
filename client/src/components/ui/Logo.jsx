/** Notebook mark and Notes Keeper wordmark. */
export default function Logo({ size = "default", className = "" }) {
  const large = size === "large";
  const landing = size === "landing";
  const dashboard = size === "dashboard";
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className={`${large ? "h-16 w-16 sm:h-24 sm:w-24" : landing ? "h-16 w-16 sm:h-20 sm:w-20" : dashboard ? "h-12 w-12" : "h-10 w-10"} shrink-0`}
        fill="none"
      >
        <rect x="9" y="5" width="31" height="38" rx="7" fill="#2FAF9A" fillOpacity=".16" stroke="#2FAF9A" strokeWidth="2.4" />
        <path d="M16 5v38M22 16h11M22 23h11M22 30h8" stroke="#FDF2F0" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M9 14h7M9 22h7M9 30h7" stroke="#FF9F86" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className={`font-display font-bold tracking-tight ${landing ? "text-4xl sm:text-5xl" : large ? "text-4xl sm:text-6xl" : dashboard ? "text-2xl" : "text-xl"}`}>
        <span className="text-[#FF9F86]">Notes</span>{" "}
        <span className="text-[#2FAF9A]">Keeper</span>
      </span>
    </div>
  );
}
