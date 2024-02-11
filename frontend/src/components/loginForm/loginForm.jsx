// loginForm.jsx
import React from "react";
import "./loginForm.css"; // Import the CSS file

export function LoginForm() {
  return (
    <div className="box-container">
      <form className="form-container">
        <input type="email" placeholder="Email" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
      </form>
      <button type="submit" className="submit-button">Signin</button>
      <p className="line-text">Don't have an accoun?</p>
    </div>
  );
}
