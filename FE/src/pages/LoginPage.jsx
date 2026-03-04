import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const { login, signup } = useAuthStore();
  const emailRef = useRef();
  const passwordRef = useRef();
  const emailRefLogin = useRef();
  const passwordRefLogin = useRef();

  const userNameRef = useRef();
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState(true);
  const [signupForm, setSignupForm] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await login({
        email: emailRefLogin.current.value,
        password: passwordRefLogin.current.value,
      });
      navigate("/home");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed";
      setLoginError(message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup({
        email: emailRef.current.value,
        name: userNameRef.current.value,
        password: passwordRef.current.value,
        role: "admin",
      });
      SwitchForm();
    } catch (err) {
      console.log(err);
    }
  };

  const SwitchForm = () => {
    setLoginError("");
    setLoginForm(!loginForm);
    setSignupForm(!signupForm);
  };

  const inputClass =
    "block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form
            onSubmit={handleLogin}
            className={`space-y-5 ${loginForm ? "block" : "hidden"}`}
          >
            <div>
              <h2 className="text-2xl font-semibold text-center text-slate-900">Welcome back</h2>
              <p className="text-center text-sm text-slate-500 mt-1">Sign in to your account</p>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-login" className={labelClass}>Email</label>
                <input id="email-login" type="email" ref={emailRefLogin} placeholder="you@example.com" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="password-login" className={labelClass}>Password</label>
                <input id="password-login" type="password" ref={passwordRefLogin} placeholder="••••••••" className={inputClass} required />
              </div>
            </div>
            {loginError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{loginError}</div>
            )}
            <button type="submit" className="w-full flex justify-center py-2.5 px-4 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              Sign in
            </button>
            <p className="text-center text-sm text-slate-500">
              <button type="button" onClick={SwitchForm} className="text-indigo-600 hover:text-indigo-800 font-medium">
                Don't have an account? Sign up
              </button>
            </p>
          </form>

          <form
            onSubmit={handleSignup}
            className={`space-y-5 ${signupForm ? "block" : "hidden"}`}
          >
            <div>
              <h2 className="text-2xl font-semibold text-center text-slate-900">Create account</h2>
              <p className="text-center text-sm text-slate-500 mt-1">Sign up to get started</p>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name-signup" className={labelClass}>Full name</label>
                <input id="name-signup" type="text" ref={userNameRef} placeholder="John Doe" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="email-signup" className={labelClass}>Email</label>
                <input id="email-signup" type="email" ref={emailRef} placeholder="you@example.com" className={inputClass} required />
              </div>
              <div>
                <label htmlFor="password-signup" className={labelClass}>Password</label>
                <input id="password-signup" type="password" ref={passwordRef} placeholder="••••••••" className={inputClass} required />
              </div>
            </div>
            <button type="submit" className="w-full flex justify-center py-2.5 px-4 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              Sign up
            </button>
            <p className="text-center text-sm text-slate-500">
              <button type="button" onClick={SwitchForm} className="text-indigo-600 hover:text-indigo-800 font-medium">
                Already have an account? Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
