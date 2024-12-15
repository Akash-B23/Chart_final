import React from "react";
import "./Header.css";
import logo from "../assets/cit_logo.jpeg";

const Header = () => {
  return (
    <div className="header">
      <img src={logo} alt="CIT.AI Logo" id="logo" />
      <h1 id="header-h1">CIT.AI</h1>
    </div>
  );
};

export default Header;
