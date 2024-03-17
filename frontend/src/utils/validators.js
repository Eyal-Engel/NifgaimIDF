// input: char
export const isDigit = (char) => {
  return /\d/.test(char);
};

// input: char
export const isHebrewAlpha = (char) => {
  return /[\u0590-\u05FF]/.test(char); // Unicode range for Hebrew letters
};

// input: char
export const isEnglishAlpha = (char) => {
  return /[A-Za-z]/.test(char);
};

// input: string, int requiredLen
export const len = (str, requiredLen) => {
  return str.length === requiredLen;
};

// input: string
export const isNotEmpty = (str) => {
  return str.trim() !== "";
};

// min len and max len
export const isLenRange = (str, minLen, maxLen) => {
  const length = str.length;
  return length >= minLen && length <= maxLen;
};

export const VALIDATOR_PASSWORD = (value) => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value);
};

export const validationPasswordsErrorType = (password, confirmPassword) => {
  const passwordValidation = VALIDATOR_PASSWORD(password);
  const secPasswordValidation = VALIDATOR_PASSWORD(confirmPassword);
  const areIdentical = password === confirmPassword;

  if (areIdentical && passwordValidation && secPasswordValidation) {
    // זהים ותקינים
    return { password: true, secPassword: true, msg: "Identical and valid" };
  } else if (areIdentical && !passwordValidation) {
    // זהים אך לא תקינים
    return {
      password: false,
      secPassword: false,
      msg: "Identical but invalid",
    };
  } else if (!areIdentical && passwordValidation && !secPasswordValidation) {
    // לא זהים אימות סיסמא לא תקין
    return {
      password: true,
      secPassword: false,
      msg: "Not identical, confirm password validation failed",
    };
  } else if (!areIdentical && secPasswordValidation && !passwordValidation) {
    // לא זהים סיסמא לא תקינה
    return {
      password: false,
      secPassword: false,
      msg: "Identical, password validation failed",
    };
  } else if (!areIdentical && !secPasswordValidation && !passwordValidation) {
    // לא זהים שניהם לא תקינים
    return {
      password: false,
      secPassword: false,
      msg: "Not identical, both invalid",
    };
  } else if (!areIdentical && secPasswordValidation && passwordValidation) {
    // לא זהים שניהם תקינים
    return {
      password: true,
      secPassword: false,
      msg: "Not identical, both valid",
    };
  }
};
