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

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(
      "log in fucntion called with credentials: ",
      emailRefLogin.current.value,
      " and password: ",
      passwordRefLogin.current.value,
    );
    try {
      await login({
        email: emailRefLogin.current.value,
        password: passwordRefLogin.current.value,
      });
      navigate("/home");
    } catch (err) {
      console.log("Login failed: ", err);
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
    setLoginForm(!loginForm);
    setSignupForm(!signupForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className={`space-y-6 ${loginForm ? "block" : "hidden"}`}
          >
            <div>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-center text-sm text-gray-600">
                Sign in to your account
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email-login"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email-login"
                  type="email"
                  ref={emailRefLogin}
                  placeholder="you@example.com"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password-login"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password-login"
                  type="password"
                  ref={passwordRefLogin}
                  placeholder="••••••••"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign In
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={SwitchForm}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Don't have an account?{" "}
                <span className="underline">Sign up instead</span>
              </button>
            </div>
          </form>

          {/* Signup Form */}
          <form
            onSubmit={handleSignup}
            className={`space-y-6 ${signupForm ? "block" : "hidden"}`}
          >
            <div>
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-center text-sm text-gray-600">
                Sign up to get started
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name-signup"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name-signup"
                  type="text"
                  ref={userNameRef}
                  placeholder="John Doe"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email-signup"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email-signup"
                  type="email"
                  ref={emailRef}
                  placeholder="you@example.com"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password-signup"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password-signup"
                  type="password"
                  ref={passwordRef}
                  placeholder="••••••••"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign Up
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={SwitchForm}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Already have an account?{" "}
                <span className="underline">Login instead</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
