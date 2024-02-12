import React from "react";
import { LoginForm } from "./loginForm";
import { motion } from "framer-motion";
import "./accountBox.css";

export default function AccountBox(props) {
  return (
    <div className="boxAccountContainer">
      <div className="topAccountContainer">
        <motion.div className="backdrop" />
        <div className="header-text">התחברות</div>
      </div>
      <div className="innerAccountContainer">
        <LoginForm />
      </div>
    </div>
  );
}
