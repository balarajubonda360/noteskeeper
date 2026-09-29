import { ArrowRight, LogIn, UserRoundPlus } from "lucide-react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout.jsx";

const choices = [
  {
    to: "/register",
    icon: UserRoundPlus,
    title: "Create your account",
    description: "Set up your personal Notes Keeper workspace and start saving notes.",
    action: "Register",
    primary: true,
  },
  {
    to: "/login",
    icon: LogIn,
    title: "Welcome back",
    description: "Sign in to continue to your notes and user dashboard.",
    action: "Log in",
    primary: false,
  },
];

export default function AccountAccess() {
  return (
    <AuthLayout>
      <section className="glass w-full rounded-3xl p-6 shadow-2xl shadow-violet/10 sm:p-9" aria-labelledby="account-title">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-mint">Your personal workspace</p>
        <h2 id="account-title" className="mt-2 font-display text-2xl font-semibold text-white/95 sm:text-3xl">Continue to Notes Keeper</h2>
        <p className="mt-2 text-sm leading-6 text-white/50">Choose an option to access your notes. Your dashboard opens after you sign in.</p>

        <div className="mt-7 space-y-3">
          {choices.map(({ to, icon: Icon, title, description, action, primary }) => (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-4 rounded-2xl border p-4 transition sm:p-5 ${primary ? "border-cyber/30 bg-cyber/10 hover:border-cyber/60 hover:bg-cyber/15" : "border-white/10 bg-white/[.03] hover:border-white/20 hover:bg-white/[.06]"}`}
            >
              <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${primary ? "bg-cyber text-ink" : "bg-white/5 text-mint"}`}>
                <Icon size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-white/90">{title}</span>
                <span className="mt-1 block text-xs leading-5 text-white/50">{description}</span>
              </span>
              <span className={`inline-flex shrink-0 items-center gap-1 text-sm font-medium ${primary ? "text-cyber" : "text-white/65"}`}>
                {action}<ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </AuthLayout>
  );
}
