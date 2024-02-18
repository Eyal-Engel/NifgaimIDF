// loginForm.jsx
import React, { useState } from "react";
import "./loginForm.css"; // Import the CSS file
import { IconButton, Input, InputAdornment } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

export function LoginForm() {
  const [userLoginInfo, setUserLoginInfo] = useState({
    privateNumber: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

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
    <div className="boxLoginContainer1">
      <form className="formLoginContainer1">
        <Input
          type="text"
          name="privateNumber"
          className="input-field1"
          placeholder="מספר אישי"
          onChange={handleInputChange}
        />
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          className="input-field1"
          placeholder="אימות סיסמא"
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility}>
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          }
        />
      </form>
      <button type="submit" className="submit-button1" onClick={handleSubmit}>
        התחבר/י
      </button>
    </div>
  );
}
