const strengthLabels = ["Add a few more characters", "Getting stronger", "Strong password"];

/** Show a simple color-coded password strength estimate while typing. */
export default function PasswordStrength({ password }) {
  const checks = [
    password.length >= 6,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ];
  const score = password ? checks.filter(Boolean).length : 0;
  const level = score <= 1 ? 1 : score <= 2 ? 2 : 3;
  const levelColor = level === 1 ? "bg-coral" : level === 2 ? "bg-honey" : "bg-mint";
  const label = level === 1 ? strengthLabels[0] : level === 2 ? strengthLabels[1] : strengthLabels[2];

  return (
    <div aria-live="polite" className="mt-2 space-y-1.5">
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3].map((segment) => (
          <span key={segment} className={`h-1 flex-1 rounded-full transition-colors ${score >= segment ? levelColor : "bg-white/10"}`} />
        ))}
      </div>
      <p className="text-[11px] text-white/40">{password ? label : "Use at least 6 characters"}</p>
    </div>
  );
}
