import { useEffect, useState } from "react";

/** Subtle ambient color behind the application content. */
export default function AuroraBackground() {
  const [visible, setVisible] = useState(() => document.visibilityState === "visible");
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return (
    <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${visible ? "" : "aurora-paused"}`}>
      <div className="aurora-blob aurora-one absolute -left-40 -top-48 h-[32rem] w-[32rem] rounded-full bg-violet/20 blur-[120px]" />
      <div className="aurora-blob aurora-two absolute -right-40 top-[18%] h-[30rem] w-[30rem] rounded-full bg-mint/15 blur-[130px]" />
      <div className="aurora-blob aurora-three absolute -bottom-52 left-[32%] h-[34rem] w-[34rem] rounded-full bg-coral/10 blur-[140px]" />
    </div>
  );
}
