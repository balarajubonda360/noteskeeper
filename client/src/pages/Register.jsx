import { useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { Eye, EyeOff, Mail, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import PasswordStrength from "../components/auth/PasswordStrength.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import useAuth from "../hooks/useAuth.js";

const fields = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Name is required.";
    else if (name.trim().length < 2 || name.trim().length > 50) nextErrors.name = "Name must be between 2 and 50 characters.";
    if (!email.trim()) nextErrors.email = "Email is required.";
    else if (!isEmail(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Password is required.";
    else if (password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    if (!confirmPassword) nextErrors.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      toast.success("Your Notes Keeper account is ready");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create your account. Please try again.");
      if (!reduceMotion) await controls.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.38 } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div animate={controls} className="glass glow-violet w-full rounded-3xl p-6 shadow-2xl shadow-violet/10 sm:p-9">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-mint">Begin with one thought</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white/95 sm:text-3xl">Create your account</h2>
          <p className="mt-2 text-sm text-white/50">Your ideas deserve a place of their own.</p>
        </div>

        <motion.form
          onSubmit={submit}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } } }}
          className="space-y-3.5"
          noValidate
        >
          <motion.div variants={fields}>
            <Input id="register-name" label="Your name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} error={errors.name} endAdornment={<UserRound size={17} />} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "register-name-error" : undefined} />
          </motion.div>

          <motion.div variants={fields}>
            <Input id="register-email" label="Email address" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} error={errors.email} endAdornment={<Mail size={17} />} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "register-email-error" : undefined} />
          </motion.div>

          <motion.div variants={fields}>
            <Input id="register-password" label="Password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} error={errors.password} endAdornment={<button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="rounded p-1 text-white/40 transition hover:text-mint">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "register-password-error" : undefined} />
            <PasswordStrength password={password} />
          </motion.div>

          <motion.div variants={fields}>
            <Input id="register-confirm-password" label="Confirm password" type={showConfirm ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} error={errors.confirmPassword} endAdornment={<button type="button" onClick={() => setShowConfirm((visible) => !visible)} aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"} className="rounded p-1 text-white/40 transition hover:text-mint">{showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}</button>} aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? "register-confirm-password-error" : undefined} />
          </motion.div>

          <motion.div variants={fields} className="pt-2">
            <Button type="submit" loading={loading} className="w-full">Create account</Button>
          </motion.div>
        </motion.form>

        <p className="mt-6 text-center text-sm text-white/45">
          Already have an account? <Link to="/login" className="font-medium text-cyber transition hover:text-white">Sign in</Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
