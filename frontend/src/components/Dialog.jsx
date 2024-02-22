import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { CacheProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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

export default function SimpleDialog(props) {
  const { onClose, open, onCreateClicked, isGraveyard, isColumn } = props;
  const [inputValue, setInputValue] = useState("");
  const [typeOfColumn, setTypeOfColumn] = useState("character varying");
  const [defaultValue, setDefaultValue] = useState(null);

  const handeldefaultValueChange = (event) => {
    setDefaultValue(event.target.value);
  };

  const handleTypeOfColumnChange = (event) => {
    setTypeOfColumn(event.target.value);
    setDefaultValue(null);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClose = () => {
    onClose(inputValue);
  };
  useEffect(() => {
    console.log(typeOfColumn);
    console.log(defaultValue);
  }, [typeOfColumn, defaultValue]);

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{ "& .MuiPaper-root": { width: "30vw", minWidth: "15rem" } }}
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
        onChange={handleInputChange}
        placeholder={
          !isGraveyard && !isColumn
            ? "שם פיקוד"
            : !isColumn
            ? "שם בית העלמין"
            : "שם העמודה חדשה"
        }
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
                  value={"number"}
                  selected={typeOfColumn === "number"}
                >
                  מספר
                </MenuItem>
                <MenuItem
                  dir="rtl"
                  value={"character varying"}
                  selected={typeOfColumn === "character varying"}
                >
                  טקסט
                </MenuItem>
                <MenuItem
                  dir="rtl"
                  value={"timestamp with time zone"}
                  selected={typeOfColumn === "timestamp with time zone"}
                >
                  תאריך
                </MenuItem>
                <MenuItem
                  dir="rtl"
                  value={"USER-DEFINED"}
                  selected={typeOfColumn === "USER-DEFINED"}
                >
                  בחירה
                </MenuItem>
                <MenuItem
                  dir="rtl"
                  value={"boolean"}
                  selected={typeOfColumn === "boolean"}
                >
                  כן/לא
                </MenuItem>
              </Select>
            </FormControl>
          </ThemeProvider>
        </CacheProvider>
      )}
      {isColumn && typeOfColumn === "character varying" && (
        <TextField
          sx={{
            width: "80%",
            margin: "auto",
            marginTop: "15px",
            direction: "rtl",
          }}
          onChange={handeldefaultValueChange}
          placeholder={"ערך ברירת מחדל"}
        />
      )}
      {isColumn && typeOfColumn === "boolean" && (
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
            <FormControlLabel value="false" control={<Radio />} label="לא" />
          </RadioGroup>
        </FormControl>
      )}
      {isColumn && typeOfColumn === "number" && (
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <TextField
              dir="rtl"
              id="outlined-number"
              label="Number"
              type="number"
              onChange={handeldefaultValueChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                width: "80%",
                margin: "auto",
                marginTop: "10px",
              }}
            />
          </ThemeProvider>
        </CacheProvider>
      )}
      {isColumn && typeOfColumn === "timestamp with time zone" && (
        <CacheProvider value={cacheRtl}>
          <div
            dir="rtl"
            style={{ margin: "auto", width: "80%", marginTop: "15px" }}
          >
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Basic date picker"
                  onChange={handeldefaultValueChange}
                />
              </LocalizationProvider>
            </ThemeProvider>
          </div>
        </CacheProvider>
      )}
      <Button
        sx={{ margin: "10px", fontSize: "1.2rem" }}
        onClick={() => onCreateClicked(inputValue)}
      >
        יצירה
      </Button>
    </Dialog>
  );
}
