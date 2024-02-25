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
  const [newColumnName, setNewColumnName] = useState("");
  const [typeOfColumn, setTypeOfColumn] = useState("STRING");
  const [defaultValue, setDefaultValue] = useState(null);

  const handeldefaultValueChange = (event) => {
    if (typeOfColumn === "DATE") {
      setDefaultValue(event.$d);
    } else {
      setDefaultValue(event.target.value);
    }
  };

  const handleTypeOfColumnChange = (event) => {
    setTypeOfColumn(event.target.value);
    setDefaultValue(null);
  };

  const handleNewNameChange = (e) => {
    setNewColumnName(e.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  const handleCreateClicked = () => {
    if (isColumn) {
      onCreateClicked(newColumnName, typeOfColumn, defaultValue);
    } else {
      onCreateClicked(newColumnName);
    }
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
        onChange={handleNewNameChange}
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
            <FormControlLabel value="false" control={<Radio />} label="לא" />
          </RadioGroup>
        </FormControl>
      )}
      {isColumn && typeOfColumn === "INTEGER" && (
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <TextField
              dir="rtl"
              id="outlined-number"
              label="מספר ברירת מחדל"
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
      {isColumn && typeOfColumn === "DATE" && (
        <CacheProvider value={cacheRtl}>
          <div
            dir="rtl"
            style={{ margin: "auto", width: "80%", marginTop: "15px" }}
          >
            <ThemeProvider theme={theme}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="il"
              >
                <DatePicker
                  label="תאריך ברירת מחדל"
                  onChange={handeldefaultValueChange}
                />
              </LocalizationProvider>
            </ThemeProvider>
          </div>
        </CacheProvider>
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
