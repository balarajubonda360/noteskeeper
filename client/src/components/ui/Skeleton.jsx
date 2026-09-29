/** Shimmering placeholder for content that has not loaded yet. */
export default function Skeleton({ className = "", variant = "line" }) {
  const shape = variant === "circle" ? "rounded-full" : "rounded-lg";
  return <div aria-hidden="true" className={`skeleton-shimmer ${shape} ${className}`} />;
}
