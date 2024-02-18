import { useState } from "react";
import "./styles.css";
import { IconButton, Input, InputAdornment } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

const strengthLabels = ["חלשה", "בינונית", "בינונית", "חזקה"];

export const PasswordStrength = ({
  id,
  placeholder,
  onChangePassword,
  onChangeConfirmPassword,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const getStrength = (password) => {
    let strengthIndicator = -1;

    if (/[a-z]/.test(password)) strengthIndicator++;
    if (/[A-Z]/.test(password)) strengthIndicator++;
    if (/\d/.test(password)) strengthIndicator++;
    if (/[^a-zA-Z0-9]/.test(password)) strengthIndicator++;

    if (password.length >= 10) strengthIndicator++;

    return strengthLabels[strengthIndicator];
  };

  const handleChange = (event, field) => {
    const value = event.target.value;
    if (field === "password") {
      setPassword(value);
      onChangePassword(value);
      setStrength(getStrength(value));
    } else if (field === "confirmPassword") {
      setConfirmPassword(value);
      onChangeConfirmPassword(value);
    }
  };

  return (
    <>
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="סיסמא"
        className="resetPasswordInputField"
        onChange={(event) => handleChange(event, "password")}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={togglePasswordVisibility}>
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        }
      />
      <Input
        id={id + "2"}
        type={showConfirmPassword ? "text" : "password"}
        name="confirmPassword"
        placeholder={placeholder}
        className="resetPasswordInputField"
        onChange={(event) => handleChange(event, "confirmPassword")}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        }
      />
      <div className={`bars ${strength}`}>
        <div></div>
      </div>
      <div className="strength">{strength && `סיסמא ${strength}`}</div>
      <p>
        סיסמא חזקה צריכה להיות באורך של לפחות 10 תווים ולהכיל אות גדולה, אות
        קטנה ומספר.
      </p>
    </>
  );
};
