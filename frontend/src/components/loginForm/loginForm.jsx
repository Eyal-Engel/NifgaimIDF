// loginForm.jsx
import React, { useState } from "react";
import "./loginForm.css"; // Import the CSS file

export function LoginForm() {
  const [userLoginInfo, setUserLoginInfo] = useState({
    privateNumber: "",
    password: "",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserLoginInfo({
      ...userLoginInfo,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    // Perform your submission logic here, for example, sending the data to an API
    console.log("Form submitted with data:", userLoginInfo);
  };

  return (
    <div className="boxLoginContainer">
      <form className="formLoginContainer">
        <input
          type="privateNumber"
          name="privateNumber"
          placeholder="מספר אישי"
          className="input-field"
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="סיסמא"
          className="input-field"
          onChange={handleInputChange}
        />
      </form>
      <button type="submit" className="submit-button" onClick={handleSubmit}>
        התחבר/י
      </button>
    </div>
  );
}
