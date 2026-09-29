import { useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import useAuth from "../hooks/useAuth.js";

const fields = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = "Email is required.";
    else if (!isEmail(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Password is required.";
    else if (password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await login({ email: email.trim(), password });
      const fullName = response.data?.user?.name?.trim().replace(/\s+/g, " ") || "there";
      toast.success(`Welcome to Notes Keeper, ${fullName}!`);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to sign in. Please try again.");
      if (!reduceMotion) await controls.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.38 } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showQuoteNotes>
      <motion.div
        animate={controls}
        className="glass glow-violet w-full rounded-3xl p-6 shadow-2xl shadow-violet/10 sm:p-9"
      >
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-mint">Your desk is waiting</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white/95 sm:text-3xl">Sign in</h2>
          <p className="mt-2 text-sm text-white/50">Pick up right where your thoughts left off.</p>
        </div>

        <motion.form
          onSubmit={submit}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.09 } } }}
          className="space-y-4"
          noValidate
        >
          <motion.div variants={fields}>
            <Input
              id="login-email"
              label="Email address"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={errors.email}
              endAdornment={<Mail size={17} />}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
            />
          </motion.div>

          <motion.div variants={fields}>
            <Input
              id="login-password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={errors.password}
              endAdornment={(
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="rounded p-1 text-white/40 transition hover:text-mint">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              )}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "login-password-error" : undefined}
            />
          </motion.div>

          <motion.div variants={fields} className="pt-2">
            <Button type="submit" loading={loading} className="w-full">Sign in to Notes Keeper</Button>
          </motion.div>
        </motion.form>

        <p className="mt-7 text-center text-sm text-white/45">
          New to Notes Keeper? <Link to="/register" className="font-medium text-cyber transition hover:text-white">Create an account</Link>
        </p>
        <p className="mt-5 flex items-center justify-center gap-2 text-[11px] text-white/30"><LockKeyhole size={13} /> Your notes stay private to your account.</p>
      </motion.div>
    </AuthLayout>
  );
}
