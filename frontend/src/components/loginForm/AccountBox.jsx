import React from "react";
import { LoginForm } from "./loginForm";
import { motion } from "framer-motion";
import "./accountBox.css";

export default function AccountBox(props) {
  return (
    <div className="boxAccountContainer1">
      <div className="topAccountContainer">
        <motion.div className="backdrop" />
        <div style={{margin: "20px", fontSize: "5rem", color: "#fff", zIndex: "10" }}>
          התחברות
        </div>
      </div>
      <div className="innerAccountContainer">
        <LoginForm />
      </div>
    </div>
  );
}
