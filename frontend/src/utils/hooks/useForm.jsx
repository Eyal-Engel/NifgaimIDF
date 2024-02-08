import { useCallback, useEffect, useState } from "react";
import {
  VALIDATE_PASSWORD_AND_SEC_PASSWORD,
  VALIDATOR_DATE_EVENT,
  VALIDATOR_FULLNAME,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_PRIVATE_NUMBER,
} from "../validators";

export default function useForm(initialInputs, isValid) {
  const [formData, setFormData] = useState({
    initialInputs: initialInputs,
    isValid: isValid,
  });

  const validateInput = useCallback(
    (inputId, value) => {
      switch (inputId) {
        case "privateNumber":
          return VALIDATOR_PRIVATE_NUMBER(value);
        case "passwordLogin":
          return true;
        case "password":
          const ans = VALIDATE_PASSWORD_AND_SEC_PASSWORD(
            value,
            formData.initialInputs["secPassword"].value
          );

          return ans.password;
        case "fullName":
          return VALIDATOR_FULLNAME(value);
        case "secPassword":
          const ansSec = VALIDATE_PASSWORD_AND_SEC_PASSWORD(
            formData.initialInputs["password"].value,
            value
          );

          return ansSec.secPassword;
        case "commandsSelector":
          return value.length !== 0;
        case "eventName":
          return (
            VALIDATOR_MAXLENGTH(value, 50) && VALIDATOR_MINLENGTH(value, 1)
          );
        case "eventDate":
          return VALIDATOR_DATE_EVENT(value);
        case "eventLocation":
          return (
            VALIDATOR_MAXLENGTH(value, 50) && VALIDATOR_MINLENGTH(value, 1)
          );
        case "description":
          return (
            VALIDATOR_MAXLENGTH(value, 1000) && VALIDATOR_MINLENGTH(value, 1)
          );
        default:
          return true;
      }
    },
    [formData]
  );

  const handleInput = (e) => {
    let newValue;
    let inputId;
    if (e.type === "update") {
      inputId = e.id;
      newValue = e.value;
    } else if (e.$d) {
      newValue = e.$d;
      inputId = "eventDate";
    } else if (e.id === "commandsSelector") {
      inputId = e.id;
      newValue = e.value;
    } else {
      newValue = e.target.value;
      inputId = e.target.id || e.target.name;
    }

    const isValidAfterChange = validateInput(inputId, newValue);
    console.log(newValue);
    console.log(inputId);
    console.log(isValidAfterChange);

    const keyArray = Object.keys(formData.initialInputs);

    let hasError = false;

    keyArray.forEach((key) => {
      if (key === inputId) {
        hasError = !isValidAfterChange || hasError;
      } else {
        hasError = !formData.initialInputs[key].isValid || hasError;
      }
    });
    console.log("has error: " + hasError);

    setFormData((prevFormData) => ({
      ...prevFormData,
      initialInputs: {
        ...prevFormData.initialInputs,
        [inputId]: {
          value: newValue,
          isValid: isValidAfterChange,
          error: false,
        },
      },
      isValid: !hasError,
    }));
  };
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleBlur = (inputId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      initialInputs: {
        ...prevFormData.initialInputs,
        [inputId]: {
          ...prevFormData.initialInputs[inputId],
          error: !prevFormData.initialInputs[inputId].isValid,
        },
      },
    }));
  };

  const handelUpdateData = (value, inputId) => {
    const isValidAfterChange = validateInput(inputId, value);

    const keyArray = Object.keys(formData.initialInputs);
    let hasError = false;

    keyArray.forEach((key) => {
      if (key === inputId) {
        hasError = !isValidAfterChange || hasError;
      } else {
        hasError = !formData.initialInputs[key].isValid || hasError;
      }
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      initialInputs: {
        ...prevFormData.initialInputs,
        [inputId]: {
          value: value,
          isValid: isValidAfterChange,
          error: false,
        },
      },
      isValid: !hasError,
    }));
  };

  return { formData, handleInput, handleBlur, handelUpdateData };
}
