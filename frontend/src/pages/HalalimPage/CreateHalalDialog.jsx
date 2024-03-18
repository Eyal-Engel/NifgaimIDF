import React, { useState, useCallback } from "react";
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
  FormHelperText,
} from "@mui/material";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import { DatePicker } from "@mui/x-date-pickers";
import { createHalal, getColumnEnums } from "../../utils/api/halalsApi";
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
  nifgaimGraveyardId: "בית קברות",
  nifgaimCommandId: "פיקוד",
};
export default function CreateHalalDialog({
  openDialog,
  setOpenDialog,
  allDataOfHalalsColumns,
  originalColumns,
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
    console.log(errors);
  }, [errors]);
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

  const handleInputChange = useCallback(
    async (column, value) => {
      let v = value;

      try {
        if (column === "nifgaimCommandId") {
          const commandId = await getCommandIdByName(value);
          v = commandId;
        } else if (column === "nifgaimGraveyardId") {
          const graveyardId = await getGraveyardIdByName(value);
          v = graveyardId;
        }
        setInputValues((prevValues) => ({
          ...prevValues,
          [column]: v,
        }));
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
      console.log("Input values:", inputValues);
      const { id, halalData } = await createHalal(loggedUserId, inputValues);

      const graveyard = await getGraveyardById(halalData.nifgaimGraveyardId);
      const graveyardName = graveyard.graveyardName;
      const commandName = await getCommandNameById(halalData.nifgaimCommandId);

      // Create a new object with updated values
      const newHalalData = {
        id,
        ...halalData,
        nifgaimGraveyardId: graveyardName,
        nifgaimCommandId: commandName,
      };

      console.log(newHalalData);

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
            {rearrangedColumns.map((column) => (
              <div
                key={column.column_name}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                {column.column_name === "nifgaimCommandId" ? (
                  <>
                    <InputLabel id={column.column_name}>
                      {translationDict[column.column_name]
                        ? translationDict[column.column_name]
                        : column.column_name}
                    </InputLabel>
                    <Select
                      {...register(column.column_name, {
                        required: {
                          value: true,
                          message: `${
                            translationDict[column.column_name]
                          } שדה חובה `,
                        },
                      })}
                      sx={{ direction: "rtl" }}
                      labelId="command-label"
                      id="command"
                      name="command"
                      defaultValue=""
                      displayEmpty
                      className="resetPasswordInputField"
                      onChange={(e) =>
                        handleInputChange(column.column_name, e.target.value)
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
                    {errors[column.column_name] && (
                      <p style={{ color: "red" }}>
                        {errors[column.column_name].message}
                      </p>
                    )}
                  </>
                ) : column.column_name === "nifgaimGraveyardId" ? (
                  <>
                    <InputLabel id={column.column_name}>
                      {translationDict[column.column_name]
                        ? translationDict[column.column_name]
                        : column.column_name}
                    </InputLabel>
                    <Select
                      sx={{ direction: "rtl" }}
                      {...register(column.column_name, {
                        required: {
                          value: true,
                          message: `${
                            translationDict[column.column_name]
                          } שדה חובה `,
                        },
                      })}
                      labelId="graveyard-label"
                      id="graveyard"
                      name="graveyard"
                      defaultValue=""
                      displayEmpty
                      className="resetPasswordInputField"
                      onChange={(event) =>
                        handleInputChange(
                          column.column_name,
                          event.target.value
                        )
                      }
                      renderValue={(value) => (value ? value : "בחר בית קברות")} // Render placeholder
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
                        <DatePicker
                          {...register(column.column_name, {
                            required: {
                              value: true,
                              message: `${
                                translationDict[column.column_name]
                              } שדה חובה `,
                            },
                          })}
                          label="תאריך פטירה "
                          sx={{ width: "100%" }}
                          onChange={(date) =>
                            handleInputChange(column.column_name, date)
                          }
                        />
                        {errors[column.column_name] && (
                          <p style={{ color: "red" }}>
                            {errors[column.column_name].message}
                          </p>
                        )}
                      </RtlPlugin>
                    ) : column.data_type === "integer" ? (
                      <>
                        <Input
                          {...register(column.column_name, {
                            required: {
                              value: true,
                              message: `${
                                translationDict[column.column_name]
                              } שדה חובה `,
                            },
                          })}
                          type="number"
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
                      <>
                        <RadioGroup
                          aria-labelledby="booleanSelect"
                          name="controlled-radio-buttons-group"
                          row
                          onChange={(e) =>
                            handleInputChange(
                              column.column_name,
                              e.target.value
                            )
                          }
                          {...register(column.column_name, {
                            required: {
                              value: true,
                              message: `${
                                translationDict[column.column_name]
                              } שדה חובה `,
                            },
                          })}
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
                        {errors[column.column_name] && (
                          <p style={{ color: "red" }}>
                            {errors[column.column_name].message}
                          </p>
                        )}
                      </>
                    ) : column.data_type === "USER-DEFINED" ? (
                      <FormControl fullWidth>
                        <InputLabel id={column.column_name}>
                          בחר אחת מהאפשרויות
                        </InputLabel>
                        <MemoizedSelect
                          {...register(column.column_name, {
                            required: {
                              value: true,
                              message: `${
                                translationDict[column.column_name]
                              } שדה חובה `,
                            },
                          })}
                          labelId={column.column_name}
                          label="בחר אחת מהאפשרויות"
                          value={inputValues[column.column_name] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              column.column_name,
                              e.target.value
                            )
                          }
                        >
                          {enums[column.column_name] &&
                            enums[column.column_name].map((option) => (
                              <MenuItem key={option} value={option}>
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
                          {...register(column.column_name, {
                            required: {
                              value: true,
                              message: `${
                                translationDict[column.column_name]
                              } שדה חובה `,
                            },
                            ...(column.column_name === "privateNumber"
                              ? {
                                  minLength: {
                                    value: 7,
                                    message: ` הכנס מספר אישי בין 7 ספרות `,
                                  },
                                }
                              : {}),
                            ...(column.column_name === "privateNumber"
                              ? {
                                  maxLength: {
                                    value: 7,
                                    message: ` הכנס מספר אישי בין 7 ספרות `,
                                  },
                                }
                              : {}),
                          })}
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
