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
  getColumnEnums,
  replaceColumnValue,
  resetColumnToDefault,
} from "../../utils/api/halalsApi";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import dayjs from "dayjs";

const MagicButtonDialog = ({
  open,
  setOpenDialog,
  allDataOfHalalsColumns,
  originalColumns,
  setRows,
}) => {
  const [inputValue, setInputValue] = useState(null);
  const [selectedColumnName, setSelectedColumnName] = useState("");
  const [selectedColumnType, setSelectedColumnType] = useState(""); // State to track selected column type
  const [enums, setEnums] = useState({}); // State to store column enums

  console.log(allDataOfHalalsColumns)
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

  function removeQuotes(inputString) {
    // Remove the overall quotes from the input string
    inputString = inputString.replace(/^{|"|}$/g, "");

    // Split the input string by commas and remove leading/trailing whitespaces
    const items = inputString.split(",").map((item) => item.trim());

    // Remove double quotes from the first and last character of each item if they are present
    const itemsWithoutQuotes = items.map((item) => {
      if (item.startsWith('"') && item.endsWith('"')) {
        return item.slice(1, -1); // Remove quotes from the beginning and end
      }
      return item;
    });

    // Join the items back into a string and return
    return `{${itemsWithoutQuotes.join(",")}}`;
  }

  useEffect(() => {
    setInputValue(null);
    setSelectedColumnName("");
    setSelectedColumnType(""); // Reset selected column type when the dialog opens
    setEnums({});
  }, []);

  const handleColumnSelect = async (columnName) => {
    setSelectedColumnName(columnName);
    const column = allDataOfHalalsColumns.find(
      (col) => col.column_name === columnName
    );
    if (column) {
      setSelectedColumnType(column.data_type);
    }
    try {
      const columnInfo = allDataOfHalalsColumns.filter(
        (column) => column.column_name === columnName
      )[0];

      if (columnInfo.data_type === "USER-DEFINED") {
        // Fetch enums for the selected column
        const response = await getColumnEnums(columnName);
        const result = removeQuotes(response);
        const columnEnums = result.slice(1, -1).split(",");
        setEnums({ ...enums, [columnName]: columnEnums });
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        let value = inputValue;
        if (
          selectedColumnType === "timestamp with time zone" &&
          !isNaN(Date.parse(inputValue))
        ) {
          value = dayjs(inputValue).format("DD/MM/YYYY");
        } else if (selectedColumnType === "boolean" && inputValue === "false") {
          value = "לא";
        } else if (selectedColumnType === "boolean" && inputValue === "true") {
          value = "כן";
        } else if (inputValue === null) {
          value = "ריק - כל התאים יהיו ריקים";
        }

        // Now value holds the corrected value based on the type of inputValue

        Swal.fire({
          title: `האם את/ה בטוח/ה שתרצה/י לאפס את כל הערכים בעמודה ${selectedColumnName} לערך ${value}`,
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
              const { columnName, newValue } = await replaceColumnValue(
                loggedUserId,
                selectedColumnName,
                inputValue
              );

              setRows((prevRows) =>
                prevRows.map((row) => ({
                  ...row,
                  [columnName]:
                    selectedColumnType === "boolean" && newValue === "true"
                      ? true
                      : selectedColumnType === "boolean" && newValue === "false"
                      ? false
                      : newValue,
                }))
              );

              Swal.fire({
                title: `הערכים בעמודה  "${selectedColumnName}" התאפסו לערך ${value} בהצלחה!`,
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
              const errors = error.response.data.body?.errors;
              let errorsForSwal = ""; // Start unordered list
              console.log(errors);
              if (errors) {
                errors.forEach((error) => {
                  if (error.message === `User is not exist.`) {
                    errorsForSwal += "<li>המשתמש שמנסה לשנות אינו קיים</li>";
                  }
                  if (error.message === `User is not authorized`) {
                    errorsForSwal += "<li>אין לך גישות לבצע פעולה זו</li>";
                  }
                  if (
                    error.message === "Column name and new value are required."
                  ) {
                    errorsForSwal += "<li> נדרש להכניס שם עמודה</li>";
                  }
                  if (error.message === "New value are required") {
                    errorsForSwal += "<li>נדרש להכניס ערך ברירת מחדל חדש</li>";
                  }
                  if (
                    error.message ===
                    `Column '${selectedColumnName}' does not exist.`
                  ) {
                    errorsForSwal += `<li>עמודה ${selectedColumnName} אינה קיימת</li>`;
                  }
                });
              } else {
                errorsForSwal += `<li>${error}</li>`;
              }

              Swal.fire({
                title: `לא ניתן לאפס את ערכי העמודה ${selectedColumnName} עם הערך ${value}`,
                html: `<ul style="direction: rtl; text-align: right">${errorsForSwal}</ul>`, // Render errors as list items
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "אישור",
                reverseButtons: true,
                customClass: {
                  container: "swal-dialog-custom",
                },
              });
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
              const { columnName, defaultValue } = await resetColumnToDefault(
                loggedUserId,
                selectedColumnName
              );

              let extractedValue = defaultValue;

              if (
                selectedColumnType === "USER-DEFINED" ||
                selectedColumnType === "timestamp with time zone" ||
                selectedColumnType === "character varying"
              ) {
                // Regular expression pattern to match anything between single quotes

                const regex = /'(.*?)'/;

                // Match the pattern and extract the value
                const match = regex.exec(defaultValue);

                // Extract the matched value
                extractedValue = match ? match[1] : null;
              }

              setRows((prevRows) =>
                prevRows.map((row) => ({
                  ...row,
                  [columnName]:
                    selectedColumnType === "boolean" &&
                    extractedValue === "true"
                      ? true
                      : selectedColumnType === "boolean" &&
                        extractedValue === "false"
                      ? false
                      : extractedValue,
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
              const errors = error.response.data.body?.errors;
              console.log(errors);
              let errorsForSwal = ""; // Start unordered list
              if (errors) {
                errors.forEach((error) => {
                  if (error.message === `User is not exist.`) {
                    errorsForSwal += "<li>המשתמש שמנסה לשנות אינו קיים</li>";
                  }
                  if (error.message === `User is not authorized`) {
                    errorsForSwal += "<li>אין לך גישות לבצע פעולה זו</li>";
                  }
                  if (error.message === "Column name is required.") {
                    errorsForSwal += "<li>נדרש להכניס שם עמודה</li>";
                  }
                  if (
                    error.message ===
                    `Column '${selectedColumnName}' does not exist.`
                  ) {
                    errorsForSwal += `<li>עמודה ${selectedColumnName} אינה קיימת</li>`;
                  }
                  if (
                    error.message === "This column has no column default value"
                  ) {
                    errorsForSwal += "<li>לעמודה זאת אין ערך ברירת מחדל</li>";
                  }
                });
              } else {
                errorsForSwal += `<li>${error}</li>`;
              }

              Swal.fire({
                title: `לא ניתן לאפס את ערכי העמודה ${selectedColumnName}`,
                html: `<ul style="direction: rtl; text-align: right">${errorsForSwal}</ul>`, // Render errors as list items
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "אישור",
                reverseButtons: true,
                customClass: {
                  container: "swal-dialog-custom",
                },
              });
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
                onChange={(e) => handleColumnSelect(e.target.value)}
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
              <RtlPlugin>
                <DatePicker
                  format="DD/MM/YYYY"
                  label="תאריך ברירת מחדל"
                  value={inputValue}
                  onChange={(date) => handleDateChange(date)}
                  sx={{ width: "100%" }}
                />
              </RtlPlugin>
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
              <RtlPlugin>
                <FormControl fullWidth>
                  <Select
                    style={{ direction: "rtl" }}
                    value={inputValue || ""}
                    onChange={(e) => handleInputChange(e)}
                    fullWidth
                  >
                    {enums[selectedColumnName] &&
                      enums[selectedColumnName].map((option) => (
                        <MenuItem
                          key={option}
                          value={option}
                          style={{ direction: "rtl" }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </RtlPlugin>
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
