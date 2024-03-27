import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  createTheme,
  ThemeProvider,
  DialogActions,
  Radio,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import Transition from "../../components/TableUtils/Transition";
import PaperComponent from "../../components/TableUtils/PaperComponent";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import Swal from "sweetalert2";
import {
  replaceColumnValue,
  resetColumnToDefault,
} from "../../utils/api/halalsApi";

const MagicButtonDialog = ({
  open,
  setOpenDialog,
  allDataOfHalalsColumns,
  originalColumns,
  setRows,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedColumnName, setSelectedColumnName] = useState("");
  const [selectedColumnType, setSelectedColumnType] = useState(""); // State to track selected column type

  // Rearrange allDataOfHalalsColumns to start with objects matching originalColumns
  const columnsNotInOriginal = allDataOfHalalsColumns.filter(
    (column) => !originalColumns.some((col) => col === column.column_name)
  );

  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";

  const theme = createTheme({
    direction: "rtl",
    palette: {
      primary: {
        main: "#ffa726",
      },
      secondary: {
        main: "#3069BE",
      },
    },
  });

  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

  useEffect(() => {
    setInputValue("");
    setSelectedColumnName("");
    setSelectedColumnType(""); // Reset selected column type when the dialog opens
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDateChange = (date) => {
    setInputValue(date);
  };

  const handleConfirmClick = () => {
    if (selectedColumnName === "") {
      Swal.fire({
        title: `לא נבחרה עמודה`,
        text: "נא לבחור עמודה ספציפית כדי לאפס את הערכים בה",
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "אישור",
        reverseButtons: true,
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    } else {
      try {
        Swal.fire({
          title: `האם את/ה בטוח/ה שתרצה/י לאפס את כל הערכים בעמודה ${selectedColumnName} לערך ${inputValue}`,
          text: "פעולה זאת איננה ניתנת לשחזור",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "אפס ערכים",
          cancelButtonText: "בטל",
          reverseButtons: true,
          customClass: {
            container: "swal-dialog-custom",
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            console.log(loggedUserId, selectedColumnName, inputValue);

            try {
              const { message, columnName, newValue } =
                await replaceColumnValue(
                  loggedUserId,
                  selectedColumnName,
                  inputValue
                );

              console.log(message, columnName, newValue);
              setRows((prevRows) =>
                prevRows.map((row) => ({
                  ...row,
                  [columnName]: newValue === "true" ? true : newValue, // Update the specific column value to its default
                }))
              );

              Swal.fire({
                title: `הערכים בעמודה  "${selectedColumnName}" התאפסו לערך ${newValue} בהצלחה!`,
                text: "",
                icon: "success",
                confirmButtonText: "אישור",
                customClass: {
                  container: "swal-dialog-custom",
                },
              }).then((result) => {
                setOpenDialog(false);
              });
            } catch (error) {
              Swal.fire({
                title: `לא ניתן לאפס את ערכי העמודה ${selectedColumnName}`,
                text: error,
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "אישור",
                reverseButtons: true,
                customClass: {
                  container: "swal-dialog-custom",
                },
              }).then((result) => {});
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleResetDefaultClick = () => {
    if (selectedColumnName === "") {
      Swal.fire({
        title: `לא נבחרה עמודה`,
        text: "נא לבחור עמודה ספציפית כדי לאפס את הערכים בה",
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "אישור",
        reverseButtons: true,
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    } else {
      try {
        Swal.fire({
          title: `האם את/ה בטוח/ה שתרצה/י לאפס את כל הערכים בעמודה ${selectedColumnName} לברירת מחדל`,
          text: "פעולה זאת איננה ניתנת לשחזור",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "אפס ערכים",
          cancelButtonText: "בטל",
          reverseButtons: true,
          customClass: {
            container: "swal-dialog-custom",
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const { message, columnName, defaultValue } =
                await resetColumnToDefault(loggedUserId, selectedColumnName);
              setRows((prevRows) =>
                prevRows.map((row) => ({
                  ...row,
                  [columnName]: defaultValue, // Update the specific column value to its default
                }))
              );

              Swal.fire({
                title: `הערכים בעמודה  "${selectedColumnName}" התאפסו בהצלחה!`,
                text: "",
                icon: "success",
                confirmButtonText: "אישור",
                customClass: {
                  container: "swal-dialog-custom",
                },
              }).then((result) => {
                setOpenDialog(false);
              });
            } catch (error) {
              Swal.fire({
                title: `לא ניתן לאפס את ערכי העמודה ${selectedColumnName}`,
                text: error,
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "אישור",
                reverseButtons: true,
                customClass: {
                  container: "swal-dialog-custom",
                },
              }).then((result) => {});
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpenDialog(false)}
      TransitionComponent={Transition}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      sx={{
        direction: "rtl",
        "& .MuiDialog-paper": {
          width: "100%",
        },
      }}
    >
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <DialogTitle>שינוי ערך בעמודה קיימת באופן גורף</DialogTitle>

          <Divider />
          <DialogContent>
            <InputLabel>בחר עמודה</InputLabel>
            <FormControl fullWidth style={{ paddingBottom: "2rem" }}>
              <Select
                value={selectedColumnName}
                displayEmpty
                onChange={(e) => {
                  setSelectedColumnName(e.target.value);
                  // Find the data type of the selected column
                  const column = allDataOfHalalsColumns.find(
                    (col) => col.column_name === e.target.value
                  );
                  if (column) {
                    setSelectedColumnType(column.data_type);
                  }
                }}
                style={{ direction: "rtl" }}
              >
                {columnsNotInOriginal.map((column) => (
                  <MenuItem
                    key={column.column_name}
                    value={column.column_name}
                    style={{ direction: "rtl" }}
                  >
                    {column.column_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Conditionally render input component based on column data type */}
            {selectedColumnType === "timestamp with time zone" && (
              <DatePicker
                label="תאריך ברירת מחדל"
                value={inputValue}
                onChange={(date) => handleDateChange(date)}
                sx={{ width: "100%" }}
              />
            )}

            {selectedColumnType === "character varying" && (
              <Input
                fullWidth
                value={inputValue}
                onChange={(e) => handleInputChange(e)}
              />
            )}
            {selectedColumnType === "integer" && (
              <Input
                fullWidth
                type="number"
                value={inputValue}
                onChange={(e) => handleInputChange(e)}
              />
            )}

            {selectedColumnType === "boolean" && (
              <FormControl>
                <RadioGroup
                  sx={{ marginRight: "1rem" }}
                  value={inputValue}
                  aria-labelledby="booleanSelect"
                  name="controlled-radio-buttons-group"
                  //   {...register(key, {
                  //     validate: () => {
                  //       if (value === null) {
                  //         console.log(value);
                  //         return `${translationDict[key] || key} שדה חובה `;
                  //       } else {
                  //         return true;
                  //       }
                  //     },
                  //   })}
                  onChange={(e) => handleInputChange(e)}
                  row
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="כן"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="לא"
                  />
                </RadioGroup>
                {/* {errors[key] && (
                  <p style={{ color: "red" }}>{errors[key].message}</p>
                )} */}
              </FormControl>
            )}

            {selectedColumnType === "USER-DEFINED" && (
              <FormControl fullWidth>
                {/* Render your user-defined input component */}
              </FormControl>
            )}

            {/* Add more conditions for other data types as needed */}
          </DialogContent>
          <Divider />
          <DialogActions>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button onClick={() => setOpenDialog(false)}>ביטול</Button>
              <div>
                <Button
                  variant="contained"
                  onClick={handleConfirmClick}
                  style={{ marginLeft: "10px" }}
                >
                  עדכן ערך חדש בכל השורות
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleResetDefaultClick}
                >
                  אפס את כל הערכים לערך ברירת המחדל
                </Button>
              </div>
            </div>
          </DialogActions>
        </ThemeProvider>
      </CacheProvider>
    </Dialog>
  );
};

export default MagicButtonDialog;
