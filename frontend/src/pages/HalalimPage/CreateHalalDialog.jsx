import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Input,
  InputLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  DialogActions,
  FormControl,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import { DatePicker } from "@mui/x-date-pickers";
import { createHalal } from "../../utils/api/halalsApi";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import {
  getCommandIdByName,
  getCommandNameById,
} from "../../utils/api/commandsApi";
import {
  getGraveyardById,
  getGraveyardIdByName,
} from "../../utils/api/graveyardsApi";
import Transition from "../../components/TableUtils/Transition";
import PaperComponent from "../../components/TableUtils/PaperComponent";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

const MemoizedSelect = React.memo(Select);

const errorDict = {
  len: "אורך",
  isNumeric: "חובה מספר",
  not_unique: "חובה ערך יחודי",
};

const translationDict = {
  id: "מספר זיהוי",
  privateNumber: "מספר אישי",
  lastName: "שם משפחה",
  firstName: "שם פרטי",
  dateOfDeath: "תאריך פטירה",
  serviceType: "סוג שירות",
  circumstances: "נסיבות המוות",
  unit: "יחידה",
  division: "חטיבה",
  specialCommunity: "קהילה מיוחדת",
  area: "אזור",
  plot: "חלקה",
  line: "שורה",
  graveNumber: "מספר קבר",
  permanentRelationship: "קשר קבוע",
  comments: "הערות",
  commandName: "פיקוד",
  graveyardName: "בית קברות",
};
export default function CreateHalalDialog({
  openDialog,
  setOpenDialog,
  allDataOfHalalsColumns,
  setRows,
  rows,
  commands,
  graveyards,
  enums,
}) {
  const [inputValues, setInputValues] = useState({});
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const defaultValues = {};
    allDataOfHalalsColumns.forEach((column) => {
      if (column.column_default !== null) {
        // Remove the default value quotes
        let defaultValue = column.column_default.replace(/^'(.*)'::.*$/, "$1");
        // Parse the default value based on data type
        if (defaultValue === "NULL::character varying") {
          defaultValue = "";
        } else if (column.data_type === "boolean") {
          defaultValue = defaultValue === "true";
        } else if (column.data_type === "timestamp with time zone") {
          defaultValue = new Date(defaultValue);
        }
        defaultValues[column.column_name] = defaultValue;
      }
    });
    setInputValues(defaultValues);
  }, [allDataOfHalalsColumns]);

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

  // Rearrange allDataOfHalalsColumns to start with objects matching originalColumns
  // const rearrangedColumns = [
  //   ...originalColumns.map((col) =>
  //     allDataOfHalalsColumns.find((item) => item.column_name === col)
  //   ),
  //   ...allDataOfHalalsColumns.filter(
  //     (item) => !originalColumns.includes(item.column_name)
  //   ),
  // ].filter((column) => column.column_name !== "id"); // Filter out the "id" column

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setInputValues({});
  };

  const handleInputChange = useCallback(
    async (column, value) => {
      try {
        if (column === "commandName") {
          const commandId = await getCommandIdByName(value);
          setInputValues((prevValues) => ({
            ...prevValues,
            ["nifgaimCommandId"]: commandId,
          }));
        } else if (column === "graveyardName") {
          const graveyardId = await getGraveyardIdByName(value);
          setInputValues((prevValues) => ({
            ...prevValues,
            ["nifgaimGraveyardId"]: graveyardId,
          }));
        } else {
          setInputValues((prevValues) => ({
            ...prevValues,
            [column]: value,
          }));
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle error appropriately, such as displaying an error message
      }
    },
    [setInputValues]
  );

  const handleSubmitForm = async () => {
    try {
      // Here you can send inputValues to your backend using a POST request
      const { id, halalData } = await createHalal(loggedUserId, inputValues);

      const graveyard = await getGraveyardById(halalData.nifgaimGraveyardId);
      const graveyardName = graveyard.graveyardName;
      const commandName = await getCommandNameById(halalData.nifgaimCommandId);

      // Create a new object with updated values
      const newHalalData = {
        id,
        ...halalData,
        graveyardName: graveyardName,
        commandName: commandName,
      };

      setRows([...rows, newHalalData]);
      Swal.fire({
        title: `נוצר בהצלחה "${newHalalData.firstName}" החלל `,
        text: "",
        icon: "success",
        confirmButtonText: "אישור",
        customClass: {
          container: "swal-dialog-custom",
        },
      }).then((result) => {
        handleCloseDialog();
      });
    } catch (error) {
      const errors = error.response.data.body?.errors;
      let errorsForSwal = ""; // Start unordered list

      if (errors) {
        errors.forEach((error) => {
          if (error.type === "notNull Violation") {
            errorsForSwal += `<li>נדרש למלא את עמודה ${
              translationDict[error.path]
            }</li>`;
          }
          if (error.type === "Validation error") {
            errorsForSwal += `<li>הערך בעמודה "${
              translationDict[error.path]
            }" לא תקין (${errorDict[error.validatorKey]})</li>`;
          }
          if (error.type === "unique violation") {
            errorsForSwal += `<li>הערך בעמודה "${
              translationDict[error.path]
            }" קיים (${errorDict[error.validatorKey]})</li>`;
          }
        });
      } else {
        const nameOfColumn =
          translationDict[error.response.data.body.parent?.column];
        errorsForSwal += `<li>התא "${nameOfColumn}" ריק</li>`;
      }
      Swal.fire({
        title: `לא ניתן לעדכן את השאר`,
        html: `<ul style="direction: rtl; text-align: right">${errorsForSwal}</ul>`,
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "אישור",
        reverseButtons: true,
        customClass: {
          container: "swal-dialog-custom",
        },
      }).then((result) => {});
    }
  };

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
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
            <DialogTitle>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    fontSize: "large",
                    color: theme.palette.secondary.main,
                  }}
                >
                  הוסף חלל חדש
                </p>
              </div>
            </DialogTitle>
          </ThemeProvider>
        </CacheProvider>
        <Divider />
        <DialogContent>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            {/* Render input fields based on columns */}
            {allDataOfHalalsColumns.map((column) => (
              <div
                key={column.column_name}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                {column.column_name === "commandName" ? (
                  <>
                    <InputLabel id={column.column_name}>פיקוד</InputLabel>
                    <FormControl>
                      <Select
                        {...register(column.column_name, {
                          required: {
                            value: true,
                            message: `${
                              translationDict[column.column_name] ||
                              column.column_name
                            } שדה חובה `,
                          },
                        })}
                        // label="בחר פיקוד מהרשימה"
                        sx={{ direction: "rtl" }}
                        labelId={column.column_name}
                        displayEmpty
                        defaultValue={""}
                        onChange={(e) => {
                          handleInputChange(column.column_name, e.target.value);
                        }}
                        renderValue={(value) => (value ? value : "בחר פיקוד")} // Render placeholder
                      >
                        <MenuItem sx={{ direction: "rtl" }} value="" disabled>
                          בחר פיקוד
                        </MenuItem>
                        {commands.map((command) => (
                          <MenuItem
                            sx={{ direction: "rtl" }}
                            key={command}
                            value={command}
                          >
                            {command}
                          </MenuItem>
                        ))}
                      </Select>

                      {errors[column.column_name] && (
                        <p style={{ color: "red" }}>
                          {errors[column.column_name].message}
                        </p>
                      )}
                    </FormControl>
                  </>
                ) : column.column_name === "graveyardName" ? (
                  <>
                    <InputLabel id={column.column_name}>בית עלמין</InputLabel>
                    <FormControl>
                      <Select
                        sx={{ direction: "rtl" }}
                        {...register(column.column_name, {
                          required: {
                            value: true,
                            message: `${
                              translationDict[column.column_name] ||
                              column.column_name
                            } שדה חובה `,
                          },
                        })}
                        labelId={column.column_name}
                        defaultValue=""
                        displayEmpty
                        onChange={(event) =>
                          handleInputChange(
                            column.column_name,
                            event.target.value
                          )
                        }
                        renderValue={(value) =>
                          value ? value : "בחר בית קברות"
                        }
                      >
                        <MenuItem sx={{ direction: "rtl" }} value="" disabled>
                          בחר בית קברות
                        </MenuItem>
                        {graveyards.map((graveyard) => (
                          <MenuItem
                            sx={{ direction: "rtl" }}
                            key={graveyard.id}
                            value={graveyard.graveyardName}
                          >
                            {graveyard.graveyardName}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors[column.column_name] && (
                        <p style={{ color: "red" }}>
                          {errors[column.column_name].message}
                        </p>
                      )}
                    </FormControl>
                  </>
                ) : (
                  <>
                    <InputLabel id={column.column_name}>
                      {translationDict[column.column_name] ||
                        column.column_name}
                    </InputLabel>
                    {column.data_type === "timestamp with time zone" ? (
                      <RtlPlugin
                        style={{
                          margin: "auto",
                          marginTop: "15px",
                        }}
                      >
                        <FormControl fullWidth>
                          <DatePicker
                            {...register(column.column_name, {
                              validate: () => {
                                if (!inputValues[column.column_name]) {
                                  return `${
                                    translationDict[column.column_name] ||
                                    column.column_name
                                  } שדה חובה `;
                                } else {
                                  return true;
                                }
                              },
                            })}
                            sx={{ width: "100%" }}
                            format="DD/MM/YYYY"
                            value={
                              inputValues[column.column_name] !== undefined
                                ? dayjs(inputValues[column.column_name])
                                : null
                            }
                            onChange={(date) => {
                              handleInputChange(column.column_name, date);
                            }}
                          />
                          {errors[column.column_name] && (
                            <p style={{ color: "red" }}>
                              {errors[column.column_name].message}
                            </p>
                          )}
                        </FormControl>
                      </RtlPlugin>
                    ) : column.data_type === "integer" ? (
                      <>
                        <Input
                          {...register(column.column_name, {
                            validate: () => {
                              if (
                                inputValues[column.column_name] === "" ||
                                inputValues[column.column_name] === undefined
                              ) {
                                return `${
                                  translationDict[column.column_name] ||
                                  column.column_name
                                } שדה חובה `;
                              } else {
                                return true;
                              }
                            },
                          })}
                          type="number"
                          inputProps={{ maxLength: "500" }}
                          value={inputValues[column.column_name] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              column.column_name,
                              e.target.value
                            )
                          }
                        />
                        {errors[column.column_name] && (
                          <p style={{ color: "red" }}>
                            {errors[column.column_name].message}
                          </p>
                        )}
                      </>
                    ) : column.data_type === "boolean" ? (
                      <FormControl>
                        <RadioGroup
                          aria-labelledby="booleanSelect"
                          name="controlled-radio-buttons-group"
                          row
                          {...register(column.column_name, {
                            validate: () => {
                              if (
                                inputValues[column.column_name]?.toString() !==
                                  "true" &&
                                inputValues[column.column_name]?.toString() !==
                                  "false"
                              ) {
                                return `${
                                  translationDict[column.column_name] ||
                                  column.column_name
                                } שדה חובה `;
                              } else {
                                return true;
                              }
                            },
                          })}
                          value={
                            inputValues[column.column_name] !== undefined
                              ? inputValues[column.column_name]
                              : ""
                          }
                          onChange={(e) => {
                            handleInputChange(
                              column.column_name,
                              e.target.value
                            );
                          }}
                        >
                          <FormControlLabel
                            value={true} // Use string values here
                            control={<Radio />}
                            sx={{ marginRight: 0 }}
                            label="כן"
                          />
                          <FormControlLabel
                            value={false} // Use string values here
                            control={<Radio />}
                            label="לא"
                          />
                        </RadioGroup>
                        {errors[column.column_name] && (
                          <p style={{ color: "red" }}>
                            {errors[column.column_name].message}
                          </p>
                        )}
                      </FormControl>
                    ) : column.data_type === "USER-DEFINED" ? (
                      <FormControl fullWidth>
                        <MemoizedSelect
                          value={inputValues[column.column_name] || ""}
                          {...register(column.column_name, {
                            validate: () => {
                              if (!inputValues[column.column_name]) {
                                return `${
                                  translationDict[column.column_name] ||
                                  column.column_name
                                } שדה חובה `;
                              } else {
                                return true;
                              }
                            },
                          })}
                          sx={{ direction: "rtl" }}
                          labelId={column.column_name}
                          // displayEmpty
                          onChange={(e) =>
                            handleInputChange(
                              column.column_name,
                              e.target.value
                            )
                          }
                          renderValue={(value) =>
                            value ? value : "בחר אחת מהאופציות"
                          } // Render placeholder
                        >
                          <MenuItem sx={{ direction: "rtl" }} value="" disabled>
                            אפשרויות בחירה
                          </MenuItem>
                          {enums[column.column_name] &&
                            enums[column.column_name].map((option) => (
                              <MenuItem
                                key={option}
                                value={option}
                                sx={{ direction: "rtl" }}
                              >
                                {option}
                              </MenuItem>
                            ))}
                        </MemoizedSelect>
                        {errors[column.column_name] && (
                          <p style={{ color: "red" }}>
                            {errors[column.column_name].message}
                          </p>
                        )}
                      </FormControl>
                    ) : (
                      <>
                        <Input
                          value={inputValues[column.column_name] || ""}
                          {...register(column.column_name, {
                            ...(column.column_name !== "comments"
                              ? {
                                  validate: () => {
                                    if (
                                      inputValues[column.column_name] === "" ||
                                      inputValues[column.column_name] ===
                                        undefined
                                    ) {
                                      return `${
                                        translationDict[column.column_name] ||
                                        column.column_name
                                      } שדה חובה `;
                                    } else {
                                      return true;
                                    }
                                  },
                                }
                              : {}),
                            ...(column.column_name === "privateNumber"
                              ? {
                                  pattern: {
                                    value: /^\d{7}$/,
                                    message: ` הכנס מספר אישי בעל 7 ספרות `,
                                  },
                                }
                              : {}),
                            // ...(column.column_name === "lastName" ||
                            // column.column_name === "firstName"
                            //   ? {
                            //       pattern: {
                            //         value: /^[a-zA-Z\u05D0-\u05EA\s]+$/,
                            //         message: ` שם יכול לכלול רק אותיות `,
                            //       },
                            //     }
                            //   : {}),
                          })}
                          inputProps={{ maxLength: "500" }}
                          onChange={(e) =>
                            handleInputChange(
                              column.column_name,
                              e.target.value
                            )
                          }
                        />
                        {errors[column.column_name] && (
                          <p style={{ color: "red" }}>
                            {errors[column.column_name].message}
                          </p>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </form>
        </DialogContent>

        <Divider />
        <DialogActions>
          <Button onClick={handleCloseDialog}>ביטול</Button>
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit(handleSubmitForm)}
          >
            צור חלל
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
