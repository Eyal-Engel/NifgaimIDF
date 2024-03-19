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
  createTheme,
  ThemeProvider,
  FormControl,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
  deleteHalal,
  getColumnEnums,
  getLeftOversByHalalId,
  getSoldierAccompaniedsByHalalId,
  updateHalal,
} from "../../utils/api/halalsApi";
import Swal from "sweetalert2";
import {
  getCommandIdByName,
  getCommandNameById,
} from "../../utils/api/commandsApi";
import {
  getGraveyardById,
  getGraveyardIdByName,
} from "../../utils/api/graveyardsApi";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { useCallback } from "react";
import Transition from "../../components/TableUtils/Transition";
import PaperComponent from "../../components/TableUtils/PaperComponent";
import { useForm } from "react-hook-form";

const errorDict = {
  len: "אורך",
  isNumeric: "חובה מספר",
  not_unique: "חובה ערך יחודי",
};

const translationDict = {
  id: "מספר זיהוי",
  privateNumber: "מספר פרטי",
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
  nifgaimGraveyardId: "בית קברות",
  nifgaimCommandId: "פיקוד",
};
export default function EditHalalDIalog({
  openDialog,
  setOpenDialog,
  selectedRow,
  allDataOfHalalsColumns,
  originalColumns,
  setRows,
  commands,
  graveyards,
  enums,
}) {
  const [soldierAccompanieds, setSoldierAccompanieds] = useState([]);
  const [leftOvers, setLeftOvers] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    console.log(errors);
  }, [errors]);
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

  const rearrangedColumns = [
    ...originalColumns.map((col) =>
      allDataOfHalalsColumns.find((item) => item.column_name === col)
    ),
    ...allDataOfHalalsColumns.filter(
      (item) => !originalColumns.includes(item.column_name)
    ),
  ].filter((column) => column.column_name !== "id"); // Filter out the "id" column

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  function formatPhoneNumber(phone) {
    const words = phone.split(" ");
    if (words.length > 0) {
      const firstWord = words[0];
      if (firstWord.length > 1) {
        const lastChar = firstWord.charAt(0);
        words[0] = firstWord.substring(1, firstWord.length) + lastChar;
      }
    }
    const reversedWords = words.reverse().join(" ");
    return <div>{reversedWords}</div>;
  }

  // const getColumnByName = useCallback(
  //   (columnName) => {
  //     return allDataOfHalalsColumns.find(
  //       (column) => column.column_name === columnName
  //     );
  //   },
  //   [allDataOfHalalsColumns]
  // );

  const handleInputChange = useCallback((column, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [column]: value, // Update state object with column name as key and value as value
    }));
  }, []);

  const handleSubmitForm = async () => {
    try {
      const updatedHalalData = {};

      // Iterate over keys in selectedRow
      for (const key in selectedRow) {
        // Check if the key exists in inputValues and has a value
        if (inputValues.hasOwnProperty(key) && inputValues[key]) {
          updatedHalalData[key] = inputValues[key]; // Use the value from inputValues
        } else {
          updatedHalalData[key] = selectedRow[key]; // Use the value from selectedRow
        }
      }

      // Get the command ID by name
      const commandId = await getCommandIdByName(
        updatedHalalData.nifgaimCommandId
      );
      // Get the graveyard ID by name
      const graveyardId = await getGraveyardIdByName(
        updatedHalalData.nifgaimGraveyardId
      );

      // Update the relevant fields in updatedHalalData
      updatedHalalData.nifgaimCommandId = commandId;
      updatedHalalData.nifgaimGraveyardId = graveyardId;

      const updatedHalal = await updateHalal(
        loggedUserId,
        selectedRow.id,
        updatedHalalData
      );

      const commandName = await getCommandNameById(
        updatedHalal.nifgaimCommandId
      );
      const graveyard = await getGraveyardById(updatedHalal.nifgaimGraveyardId);

      const graveyardName = graveyard.graveyardName;

      // Replace nifgaimCommandId and nifgaimGraveyardId in updatedHalal with their names
      updatedHalal.nifgaimCommandId = commandName;
      updatedHalal.nifgaimGraveyardId = graveyardName;

      // Update the row in the state
      setRows((prevRows) =>
        prevRows.map((row) => {
          if (row.id === selectedRow.id) {
            return { ...row, ...updatedHalal };
          }
          return row;
        })
      );
      Swal.fire({
        title: `עודכן בהצלחה "${updatedHalal.firstName}" החלל `,
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
            if (error.path === "privateNumber") {
              errorsForSwal += `<li>קיים חלל עם ${
                translationDict[error.path]
              }: ${error.value} (${errorDict[error.validatorKey]})</li>`;
            } else {
              errorsForSwal += `<li>הערך בעמודה "${
                translationDict[error.path]
              }" קיים (${errorDict[error.validatorKey]})</li>`;
            }
          }
        });
      } else {
        const nameOfColumn =
          translationDict[error.response.data.body.parent.column];
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

  const handleDeleteClick = (id) => () => {
    try {
      const halalName = selectedRow.firstName + " " + selectedRow.lastName;

      Swal.fire({
        title: `האם את/ה בטוח/ה שתרצה/י למחוק החלל ${halalName}`,
        text: "פעולה זאת איננה ניתנת לשחזור",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "מחק חלל",
        cancelButtonText: "בטל",
        reverseButtons: true,
        customClass: {
          container: "swal-dialog-custom",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteHalal(loggedUserId, selectedRow.id);
            setRows((prevRows) =>
              prevRows.filter((row) => row.id !== selectedRow.id)
            );
            Swal.fire({
              title: `חלל "${halalName}" נמחק בהצלחה!`,
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
              title: `לא ניתן למחוק את החלל`,
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
                  עריכת חלל
                </p>
                <p
                  style={{
                    fontSize: "large",
                    color: theme.palette.secondary.main,
                  }}
                >
                  {selectedRow &&
                    selectedRow.lastName + " " + selectedRow.firstName}
                </p>
              </div>
            </DialogTitle>
          </ThemeProvider>
        </CacheProvider>
        <Divider></Divider>

        {/* check here */}
        <DialogContent>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            {rearrangedColumns.map((column) => {
              const { column_name: key, data_type } = column;
              const value =
                inputValues[key] !== undefined
                  ? inputValues[key]
                  : selectedRow[key]; // Get value from inputValues if available, otherwise fallback to selectedRow

              return (
                <div
                  key={key}
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  {key === "nifgaimCommandId" ? (
                    <>
                      <InputLabel id={key}>
                        {translationDict[key] ? translationDict[key] : key}
                      </InputLabel>
                      <FormControl>
                        <Select
                          {...register(key, {
                            required: {
                              value: true,
                              message: `${
                                translationDict[key] || key
                              } שדה חובה `,
                            },
                          })}
                          sx={{ direction: "rtl" }}
                          labelId={key}
                          value={value}
                          displayEmpty
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          renderValue={(value) => (value ? value : "פיקוד")} // Render placeholder
                        >
                          <MenuItem sx={{ direction: "rtl" }} value="" disabled>
                            פיקוד
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
                        {errors[key] && (
                          <p style={{ color: "red" }}>{errors[key].message}</p>
                        )}
                      </FormControl>
                    </>
                  ) : key === "nifgaimGraveyardId" ? (
                    <>
                      <InputLabel id={key}>
                        {translationDict[key] ? translationDict[key] : key}
                      </InputLabel>
                      <FormControl>
                        <Select
                          {...register(key, {
                            required: {
                              value: true,
                              message: `${
                                translationDict[key] || key
                              } שדה חובה `,
                            },
                          })}
                          sx={{ direction: "rtl" }}
                          labelId={key}
                          value={value}
                          displayEmpty
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          renderValue={(value) =>
                            value ? value : "בחר בית קברות"
                          } // Render placeholder
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
                        {errors[key] && (
                          <p style={{ color: "red" }}>{errors[key].message}</p>
                        )}
                      </FormControl>
                    </>
                  ) : (
                    <>
                      <InputLabel id={key}>
                        {translationDict[key] ? translationDict[key] : key}
                      </InputLabel>
                      {data_type === "timestamp with time zone" ? (
                        <RtlPlugin
                          style={{
                            margin: "auto",
                            marginTop: "15px",
                          }}
                        >
                          <FormControl fullWidth>
                            <DatePicker
                              {...register(key, {
                                required: {
                                  value: true,
                                  message: `${
                                    translationDict[key] || key
                                  } שדה חובה `,
                                },
                              })}
                              label="תאריך ברירת מחדל"
                              value={dayjs(value)}
                              onChange={(date) => handleInputChange(key, date)}
                              sx={{ width: "100%" }}
                            />
                            {errors[key] && (
                              <p style={{ color: "red" }}>
                                {errors[key].message}
                              </p>
                            )}
                          </FormControl>
                        </RtlPlugin>
                      ) : data_type === "integer" ? (
                        <>
                          <Input
                            {...register(key, {
                              required: {
                                value: true,
                                message: `${
                                  translationDict[key] || key
                                } שדה חובה `,
                              },
                            })}
                            type="number"
                            value={value}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                          />
                          {errors[key] && (
                            <p style={{ color: "red" }}>
                              {errors[key].message}
                            </p>
                          )}
                        </>
                      ) : data_type === "boolean" ? (
                        <FormControl>
                          <RadioGroup
                            value={value}
                            aria-labelledby="booleanSelect"
                            name="controlled-radio-buttons-group"
                            {...register(key, {
                              validate: () => {
                                if (value === null) {
                                  console.log(value);
                                  return `${
                                    translationDict[key] || key
                                  } שדה חובה `;
                                } else {
                                  return true;
                                }
                              },
                            })}
                            onChange={(e) => {
                              handleInputChange(key, e.target.value);
                              console.log(e.target.value);
                            }}
                            row
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              sx={{ marginRight: 0 }}
                              label="כן"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="לא"
                            />
                          </RadioGroup>
                          {errors[key] && (
                            <p style={{ color: "red" }}>
                              {errors[key].message}
                            </p>
                          )}
                        </FormControl>
                      ) : data_type === "USER-DEFINED" ? (
                        <FormControl fullWidth>
                          <Select
                            {...register(key, {
                              required: {
                                value: true,
                                message: `${
                                  translationDict[key] || key
                                } שדה חובה `,
                              },
                            })}
                            sx={{ direction: "rtl" }}
                            labelId={key}
                            value={value || ""}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                          >
                            {enums[key] ? (
                              enums[key].map((option) => (
                                <MenuItem
                                  key={option}
                                  value={option}
                                  selected={option.trim() === value?.trim()}
                                >
                                  {option}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value={value}>{value}</MenuItem>
                            )}
                          </Select>
                          {errors[key] && (
                            <p style={{ color: "red" }}>
                              {errors[key].message}
                            </p>
                          )}
                        </FormControl>
                      ) : (
                        <>
                          <Input
                            value={inputValues[key] || value}
                            {...register(key, {
                              required: {
                                value: true,
                                message: `${
                                  translationDict[key] || key
                                } שדה חובה `,
                              },
                              ...(key === "privateNumber"
                                ? {
                                    pattern: {
                                      value: /^\d{7}$/,
                                      message: ` הכנס מספר אישי בין 7 ספרות `,
                                    },
                                  }
                                : {}),
                              ...(key === "lastName" || key === "firstName"
                                ? {
                                    pattern: {
                                      value: /^[a-zA-Z\u05D0-\u05EA]+$/,
                                      message: ` שם יכול לכלול רק אותיות `,
                                    },
                                  }
                                : {}),
                            })}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                          />
                          {errors[key] && (
                            <p style={{ color: "red" }}>
                              {errors[key].message}
                            </p>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })}
            {/* Code for displaying soldierAccompanieds and leftOvers */}
            <div>
              <h2 style={{ color: theme.palette.secondary.main }}>מלווים </h2>
              {soldierAccompanieds.length === 0 ? (
                <p>אין מלווים משוייכים</p>
              ) : (
                soldierAccompanieds.map((soldier, index) => (
                  <div key={index}>
                    <p>
                      {`שם: `}
                      <strong>{soldier.fullName}</strong>
                    </p>
                    <p>
                      {`מספר פרטי: `}
                      <strong>{soldier.privateNumber}</strong>
                    </p>
                    <p>
                      {`דרגה: `}
                      <strong>{soldier.rank}</strong>
                    </p>
                    <p>
                      {`טלפון: `}
                      <strong>{formatPhoneNumber(soldier.phone)}</strong>
                    </p>
                    <p>
                      {`יחידה: `}
                      <strong>{soldier.unit}</strong>
                    </p>
                    <p>
                      {`הערות: `}
                      <strong>{soldier.comments}</strong>
                    </p>
                    <br />
                  </div>
                ))
              )}
              <br />
            </div>
            <div>
              <h2 style={{ color: theme.palette.secondary.main }}>שארים</h2>
              {leftOvers.length === 0 ? (
                <p>אין שארים משוייכים</p>
              ) : (
                leftOvers.map((leftOver, index) => (
                  <div key={index}>
                    <p>
                      {`שם: `}
                      <strong>{leftOver.fullName}</strong>
                    </p>
                    <p>
                      {`קרובות: `}
                      <strong>{leftOver.proximity}</strong>
                    </p>
                    <p>
                      {`עיר: `}
                      <strong>{leftOver.city}</strong>
                    </p>
                    <p>
                      {`כתובת: `}
                      <strong>{leftOver.address}</strong>
                    </p>
                    <p>
                      {`טלפון: `}
                      <strong>{formatPhoneNumber(leftOver.phone)}</strong>
                    </p>
                    <p>
                      {`הערות: `}
                      <strong>{leftOver.comments}</strong>
                    </p>
                    <p>
                      {`דתי: `}
                      <strong>{leftOver.isReligious ? "כן" : "לא"}</strong>
                    </p>
                    <br />
                  </div>
                ))
              )}
              <br />
            </div>
          </form>
        </DialogContent>

        <Divider></Divider>
        <DialogActions>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button onClick={handleCloseDialog}>ביטול</Button>
            <div>
              <Button
                variant="contained"
                onClick={handleSubmit(handleSubmitForm)}
                style={{ marginLeft: "10px" }}
              >
                שמור שינויים
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteClick(selectedRow.id)}
              >
                מחיקה
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
