import { useState } from "react";
import "./styles.css";
import { IconButton, Input, InputAdornment } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

const strengthLabels = ["חלשה", "בינונית", "בינונית", "חזקה"];

export const PasswordStrength = ({
  id,
  placeholder,
  register,
  errors,
  userSignUpInfo,
  onChangePassword,
  onChangeConfirmPassword,
}) => {
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
      onChangePassword(value);
      setStrength(getStrength(value));
    } else if (field === "confirmPassword") {
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
        {...register("password", {
          required: {
            value: true,
            message: "סיסמא שדה חובה",
          },
          pattern: {
            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
            message: ` סיסמא חייבת להיות באורך של 6 תווים ולכלול אותיות `,
          },
        })}
        onChange={(event) => handleChange(event, "password")}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={togglePasswordVisibility}>
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        }
      />
      {errors["password"] && (
        <p style={{ color: "red" }}>{errors["password"].message}</p>
      )}
      <Input
        id={id + "2"}
        type={showConfirmPassword ? "text" : "password"}
        name="confirmPassword"
        placeholder={placeholder}
        {...register("confirmPassword", {
          validate: (value) => {
            console.log(value);
            if (value === "") {
              return "אימות סיסמא שדה חובה";
            }
            if (value !== userSignUpInfo.password) {
              return "סיסמאות אינן זהות";
            } else {
              return true;
            }
          },
        })}
        //   pattern: {
        //     value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        //     message: ` סיסמא חייבת להיות באורך של 6 תווים ולכלול אותיות `,
        //   },
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
      {errors["confirmPassword"] && (
        <p style={{ color: "red" }}>{errors["confirmPassword"].message}</p>
      )}
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
