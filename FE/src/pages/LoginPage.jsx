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
    <React.Fragment>
      <div className="relative">
        <form
          onSubmit={handleLogin}
          className={`m-5 flex flex-col gap-2 ${
            loginForm == true ? "visible" : "hidden"
          }`}
        >
          <input placeholder="Email ID" ref={emailRefLogin} />
          <input
            type="password"
            placeholder="Password"
            ref={passwordRefLogin}
          />
          <button type="submit">Login</button>
          <a onClick={SwitchForm}>Don't have an account? Sign up instead.</a>
        </form>

        <form
          onSubmit={handleSignup}
          className={`m-5 flex flex-col gap-2 ${
            signupForm == true ? "visible" : "hidden"
          }`}
        >
          <input placeholder="Email ID" ref={emailRef} />
          <input placeholder="Name" ref={userNameRef} />
          <input type="password" placeholder="Password" ref={passwordRef} />
          <button type="submit">Sign Up</button>
          <a onClick={SwitchForm}>Already have an account? Login instead.</a>
        </form>
      </div>
    </React.Fragment>
  );
};

export default LoginPage;
