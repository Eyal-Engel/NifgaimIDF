// loginForm.jsx
import React, { useContext, useState } from "react";
import "./loginForm.css"; // Import the CSS file
import { IconButton, Input, InputAdornment } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AuthContext } from "../../utils/contexts/authContext";
import { loginUser } from "../../utils/api/usersApi";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const [userLoginInfo, setUserLoginInfo] = useState({
    privateNumber: "",
    password: "",
  });
  const auth = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
  const handleSubmit = async () => {
    console.log("Form submitted with data:", userLoginInfo);

    const creditentials = {
      privateNumber: userLoginInfo.privateNumber,
      password: userLoginInfo.password,
    };

    try {
      const response = await loginUser(creditentials);
      console.log(response);
      auth.login(response.data.userId, response.data.token);
      navigate("/halalim");
    } catch (error) {
      console.log(error.response.data.body);
    }
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
