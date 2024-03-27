import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { CacheProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import RtlPlugin from "./rtlPlugin/RtlPlugin";
import Swal from "sweetalert2";

const theme = (outerTheme) =>
  createTheme({
    direction: "rtl",
    palette: {
      mode: outerTheme.palette.mode,
      primary: { main: outerTheme.palette.primary.main },
    },
  });

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const ReusableCreateItemDialog = React.memo(
  ({ onClose, open, onCreateClicked, isGraveyard, isColumn }) => {
    const [newColumnName, setNewColumnName] = useState("");
    const [typeOfColumn, setTypeOfColumn] = useState("STRING");

    // const [values, setValues] = useState([1, 2]);
    const [enumValues, setEnumValues] = useState(["", ""]);
    const [defaultValue, setDefaultValue] = useState(null);
    const [enumDefaultValue, setEnumDefaultValue] = useState(enumValues[0]);
    const [errorMessage, setErrorMessage] = useState({
      show: false,
      message: "חובה להכניס שם",
    });

    const cleanUpStates = () => {
      console.log("in cleanUpStates");
      setNewColumnName("");
      setTypeOfColumn("STRING");
      setEnumValues(["", ""]);
      setDefaultValue(null);
      setEnumDefaultValue(enumValues[0]);
      // setErrorMessage({
      //   show: false,
      //   message: "חובה להכניס שם",
      // });
    };

    const handleEnumValueChange = (index, event) => {
      const newEnumValues = [...enumValues];
      newEnumValues[index] = event.target.value;
      setEnumValues(newEnumValues);
    };

    const addEnumValueField = () => {
      setEnumValues([...enumValues, ""]);
    };

    const deleteEnumValueField = (index) => {
      if (enumValues.length <= 2) return; // Ensures there are at least 2 options
      const newEnumValues = [...enumValues];
      newEnumValues.splice(index, 1);
      setEnumValues(newEnumValues);
    };

    const handleCreateClicked = () => {
      if (isColumn) {
        if (typeOfColumn === "ENUM") {
          console.log(enumValues);
          let emptyFlag = false;
          const trimmedEnumValues = enumValues.map((value) => {
            if (value.trim() !== "") {
              return value.trim();
            } else {
              emptyFlag = true;
            }
            return "";
          });
          const resultString = "select: [" + trimmedEnumValues.join(", ") + "]";
          console.log(resultString);
          !emptyFlag
            ? onCreateClicked(
                newColumnName,
                resultString,
                enumDefaultValue.trim(),
                trimmedEnumValues
              )
            : Swal.fire({
                title: ` לא ניתן ליצור את העמודה ${newColumnName}`, // changed from command
                html: `לא הכנסת ערכים לבחירה`, // Render errors as list items
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "אישור",
                reverseButtons: true,
                customClass: {
                  container: "swal-dialog-custom",
                },
              });
        } else if (typeOfColumn === "DATE") {
          console.log(defaultValue);
          if (defaultValue) {
            const dateObject = new Date(defaultValue);

            const day = dateObject.getDate().toString().padStart(2, "0");
            const month = (dateObject.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const year = dateObject.getFullYear();

            const formatDate = `${day}/${month}/${year}`;
            console.log(formatDate);
            onCreateClicked(newColumnName, typeOfColumn, formatDate);
          } else {
            const emptyValue = "לא הוגדר ערך ברירת מחדל";
            onCreateClicked(newColumnName, typeOfColumn, emptyValue);
          }
        } else if (typeOfColumn === "INTEGER") {
          if (!isNaN(defaultValue)) {
            onCreateClicked(newColumnName, typeOfColumn, defaultValue);
          } else {
            Swal.fire({
              title: ` לא ניתן ליצור את העמודה ${newColumnName}`, // changed from command
              html: `נדרש להכניס מספר לערך ברירת מחדל`, // Render errors as list items
              icon: "error",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "אישור",
              reverseButtons: true,
              customClass: {
                container: "swal-dialog-custom",
              },
            });
          }
        } else {
          if (newColumnName === "") {
            setErrorMessage({ ...errorMessage, show: true });
          } else {
            onCreateClicked(newColumnName, typeOfColumn, defaultValue);
            setErrorMessage({ ...errorMessage, show: false });
          }
        }
        cleanUpStates();
      } else {
        if (newColumnName === "") {
          setErrorMessage({ ...errorMessage, show: true });
        } else {
          onCreateClicked(newColumnName);
          setErrorMessage({ ...errorMessage, show: false });
          cleanUpStates();
        }
      }
    };

    const handeldefaultValueChange = (event) => {
      if (typeOfColumn === "DATE") {
        console.log("herre");
        console.log(typeOfColumn);
        setDefaultValue(event?.$d);
      } else if (typeOfColumn === "ENUM") {
        setEnumDefaultValue(event.target.value);
      } else {
        setDefaultValue(event.target.value);
      }
    };

    const handleTypeOfColumnChange = (event) => {
      setTypeOfColumn(event.target.value);
      setEnumValues(["", ""]);
      setEnumDefaultValue("");
      setDefaultValue(null);
    };

    const handleNewNameChange = (e) => {
      setNewColumnName(e.target.value);
    };

    const handleClose = () => {
      console.log("close");
      cleanUpStates();
      onClose();
    };

    return (
      <Dialog
        onClose={handleClose}
        open={open}
        sx={{ "& .MuiPaper-root": { width: "40vw", minWidth: "15rem" } }}
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          {!isGraveyard && !isColumn
            ? "יצירת פיקוד"
            : !isColumn
            ? "יצירת בית עלמין"
            : "יצירת עמודה חדשה"}
        </DialogTitle>
        <TextField
          sx={{ width: "80%", margin: "auto", direction: "rtl" }}
          onChange={handleNewNameChange}
          placeholder={
            !isGraveyard && !isColumn
              ? "שם פיקוד"
              : !isColumn
              ? "שם בית העלמין"
              : "שם העמודה חדשה"
          }
          inputProps={{ maxLength: "500" }}
        ></TextField>
        {isColumn && (
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <FormControl
                className="selectTypeOfColumn"
                sx={{
                  m: 1,
                  width: "80%",
                  zIndex: 0,
                  margin: "auto",
                  marginTop: "1rem",
                }}
              >
                <InputLabel id="columnType">סוג</InputLabel>
                <Select
                  dir="rtl"
                  labelId="columnType"
                  id="columnType"
                  value={typeOfColumn}
                  label="סוג"
                  onChange={handleTypeOfColumnChange}
                >
                  <MenuItem
                    dir="rtl"
                    value={"INTEGER"}
                    selected={typeOfColumn === "INTEGER"}
                  >
                    מספר
                  </MenuItem>
                  <MenuItem
                    dir="rtl"
                    value={"STRING"}
                    selected={typeOfColumn === "STRING"}
                  >
                    טקסט
                  </MenuItem>
                  <MenuItem
                    dir="rtl"
                    value={"DATE"}
                    selected={typeOfColumn === "DATE"}
                  >
                    תאריך
                  </MenuItem>
                  <MenuItem
                    dir="rtl"
                    value={"ENUM"}
                    selected={typeOfColumn === "ENUM"}
                  >
                    בחירה
                  </MenuItem>
                  <MenuItem
                    dir="rtl"
                    value={"BOOLEAN"}
                    selected={typeOfColumn === "BOOLEAN"}
                  >
                    כן/לא
                  </MenuItem>
                </Select>
              </FormControl>
            </ThemeProvider>
          </CacheProvider>
        )}
        {isColumn && typeOfColumn === "STRING" && (
          <TextField
            sx={{
              width: "80%",
              margin: "auto",
              marginTop: "15px",
              direction: "rtl",
            }}
            onChange={handeldefaultValueChange}
            placeholder={"ערך ברירת מחדל"}
            inputProps={{ maxLength: "500" }}
          />
        )}
        {isColumn && typeOfColumn === "BOOLEAN" && (
          <FormControl
            sx={{
              width: "80%",
              margin: "auto",
              marginTop: "10px",
              direction: "rtl",
            }}
          >
            <FormLabel sx={{ width: "80%" }} id="booleanSelect">
              ברירת מחדל
            </FormLabel>
            <RadioGroup
              aria-labelledby="booleanSelect"
              name="controlled-radio-buttons-group"
              onChange={handeldefaultValueChange}
              row
            >
              <FormControlLabel value={true} control={<Radio />} label="כן" />
              <FormControlLabel value={false} control={<Radio />} label="לא" />
            </RadioGroup>
          </FormControl>
        )}
        {isColumn && typeOfColumn === "INTEGER" && (
          <RtlPlugin
            style={{ margin: "auto", width: "80%", marginTop: "15px" }}
          >
            <TextField
              dir="rtl"
              id="outlined-number"
              label="מספר ברירת מחדל"
              type="number"
              onChange={handeldefaultValueChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              inputProps={{ maxLength: "500" }}
            />
          </RtlPlugin>
        )}
        {isColumn && typeOfColumn === "DATE" && (
          <RtlPlugin
            style={{ margin: "auto", width: "80%", marginTop: "15px" }}
          >
            <DatePicker
              format="DD/MM/YYYY"
              label="תאריך ברירת מחדל"
              onChange={handeldefaultValueChange}
              sx={{ width: "100%" }}
            />
          </RtlPlugin>
        )}
        {isColumn && typeOfColumn === "ENUM" && (
          <>
            {enumValues.map((value, index) => (
              <div
                key={index}
                style={{
                  margin: "auto",
                  direction: "rtl",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "15px",
                  width: "80%",
                }}
              >
                <TextField
                  sx={{
                    direction: "rtl",
                  }}
                  fullWidth
                  onChange={(event) => handleEnumValueChange(index, event)}
                  value={value}
                  placeholder={`ערך ${index + 1}`}
                  inputProps={{ maxLength: "500" }}
                />
                {index > 1 && (
                  <IconButton onClick={() => deleteEnumValueField(index)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                )}
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                color="secondary"
                onClick={addEnumValueField}
                style={{ marginTop: "15px" }}
              >
                <AddIcon />
              </Button>
              <Select
                sx={{
                  width: "80%",
                  margin: "auto",
                  marginTop: "15px",
                  direction: "rtl",
                }}
                value={enumDefaultValue}
                onChange={(event) => setEnumDefaultValue(event.target.value)}
              >
                {enumValues.map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </>
        )}
        {errorMessage.show && (
          <p style={{ color: "red", margin: "auto", marginTop: "10px" }}>
            {errorMessage.message}
          </p>
        )}
        <Button
          sx={{ margin: "10px", fontSize: "1.2rem" }}
          onClick={handleCreateClicked}
        >
          יצירה
        </Button>
      </Dialog>
    );
  }
);
export default React.memo(ReusableCreateItemDialog);
