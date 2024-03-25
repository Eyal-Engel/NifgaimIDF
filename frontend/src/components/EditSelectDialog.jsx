import React, { useState } from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
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
import AddIcon from "@mui/icons-material/Add";

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

export default function EditSelectDialog({
  columnType,
  columnName,
  enumValuesFromColumn,
  defaultValueFromColumn,
  onClose,
  open,
  onSaveClicked,
}) {
  const [newColumnName, setNewColumnName] = useState(columnName);

  // const [values, setValues] = useState([1, 2]);
  const [enumValues, setEnumValues] = useState(enumValuesFromColumn);
  const [defaultValue, setDefaultValue] = useState(defaultValueFromColumn);

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

  const handleSaveClicked = () => {
    onSaveClicked(newColumnName, columnType, defaultValue, enumValues);
  };

  const handleNewNameChange = (e) => {
    setNewColumnName(e.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{ "& .MuiPaper-root": { width: "30vw", minWidth: "15rem" } }}
    >
      <DialogTitle sx={{ textAlign: "center" }}>עריכת עמודת בחירה</DialogTitle>
      <TextField
        sx={{ width: "80%", margin: "auto", direction: "rtl" }}
        value={newColumnName}
        onChange={handleNewNameChange}
        placeholder="שם העמודה החדשה"
      ></TextField>
      {/* <CacheProvider value={cacheRtl}>
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
              value={columnType}
              label="סוג"
              disabled
            >
              <MenuItem
                dir="rtl"
                value={"ENUM"}
                selected={columnType === "ENUM"}
              >
                בחירה
              </MenuItem>
            </Select>
          </FormControl>
        </ThemeProvider>
      </CacheProvider>

      {enumValues.map((value, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {index > 1 && (
            <IconButton onClick={() => deleteEnumValueField(index)}>
              <DeleteIcon color="error" />
            </IconButton>
          )}
          <TextField
            sx={{
              width: "80%",
              marginTop: "15px",
              direction: "rtl",
            }}
            onChange={(event) => handleEnumValueChange(index, event)}
            value={value}
            placeholder={`ערך ${index + 1}`}
          />
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
          value={defaultValue}
          onChange={(event) => setDefaultValue(event.target.value)}
        >
          {enumValues.map((value, index) => (
            <MenuItem key={index} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </div> */}

      <Button
        sx={{ margin: "10px", fontSize: "1.2rem" }}
        onClick={handleSaveClicked}
      >
        שמור
      </Button>
    </Dialog>
  );
}
