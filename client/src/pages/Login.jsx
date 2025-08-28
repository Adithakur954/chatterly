// src/pages/Login.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { login, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authLoading) return;

    if (!acceptedTerms) {
      toast.error("Please accept terms");
      return;
    }

    // Basic validation for signup step 1
    if (mode === "signup" && step === 1) {
      if (!form.fullName || !form.email || !form.password) {
        toast.error("Fill required fields");
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      setStep(2);
      return;
    }

    try {
      let res;
      if (mode === "signup") {
        res = await login("signup", {
          name: form.fullName,
          email: form.email,
          password: form.password,
          bio: form.bio,
        });
      } else {
        res = await login("login", { email: form.email, password: form.password });
      }

      console.log("login() returned:", res);
      console.log("localStorage token:", localStorage.getItem("token"));

      // check shape returned by AuthContext.login
      if (res?.success) {
        // navigation now
        navigate("/"); // <- should take user to Home
        return;
      }

      // If not success, display detailed error if available
      const message =
        res?.error?.response?.data?.message ||
        res?.error?.message ||
        "Login / Signup failed";
      toast.error(message);
    } catch (err) {
      console.error("Unexpected error in handleSubmit:", err);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gap-8 sm:justify-evenly bg-[#0b0a16] text-white p-6">
      <div className="flex items-center flex-col text-center">
        <img src={assets.logo_icon} alt="logo" className="w-[min(30vw,250px)]" />
        <p className="text-4xl mt-4 font-semibold">Chatterly</p>
      </div>

      <form onSubmit={handleSubmit} className="w-[min(90vw,420px)] bg-white/5 border border-gray-600 p-6 rounded-xl flex flex-col gap-6">
        <h2 className="text-2xl font-medium">
          {mode === "signup" ? (step === 1 ? "Sign Up" : "Tell us about you") : "Login"}
        </h2>

        {/* inputs */}
        {(mode === "login" || (mode === "signup" && step === 1)) && (
          <>
            {mode === "signup" && step === 1 && (
              <input name="fullName" value={form.fullName} onChange={onChange} placeholder="Full Name" className="p-3 bg-transparent border border-gray-400 rounded-lg" required />
            )}
            <input name="email" value={form.email} onChange={onChange} type="email" placeholder="Email" className="p-3 bg-transparent border border-gray-400 rounded-lg" required />
            <input name="password" value={form.password} onChange={onChange} type="password" placeholder="Password" className="p-3 bg-transparent border border-gray-400 rounded-lg" required />
            {mode === "signup" && step === 1 && (
              <input name="confirmPassword" value={form.confirmPassword} onChange={onChange} type="password" placeholder="Confirm Password" className="p-3 bg-transparent border border-gray-400 rounded-lg" required />
            )}
          </>
        )}

        {mode === "signup" && step === 2 && (
          <textarea name="bio" value={form.bio} onChange={onChange} placeholder="Short bio (optional)" className="p-3 bg-transparent border border-gray-400 rounded-lg h-28" />
        )}

        <div className="flex items-center gap-2 text-sm text-gray-200">
          <input id="terms" type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
          <label htmlFor="terms">I agree to the terms and conditions</label>
        </div>

        <button type="submit" disabled={authLoading} className="py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium disabled:opacity-60">
          {authLoading ? "Please wait..." : mode === "login" ? "Login" : step === 1 ? "Continue" : "Create Account"}
        </button>

        <div className="text-center text-sm text-gray-300">
          {mode === "signup" ? (
            <p>
              Already have an account?{" "}
              <button type="button" onClick={() => { setMode("login"); setStep(1); }} className="text-blue-400">Login</button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button type="button" onClick={() => { setMode("signup"); setStep(1); }} className="text-blue-400">Sign Up</button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
