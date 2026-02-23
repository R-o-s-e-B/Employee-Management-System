import React from "react";
import { Link } from "react-router-dom";

const WelcomeScreen = () => {
  return (
    <React.Fragment>
      <nav>
        <Link className="m-10" to="/">
          Home
        </Link>
        <Link to="/login">Login/Signup Page</Link>
      </nav>
    </React.Fragment>
  );
};

export default WelcomeScreen;
