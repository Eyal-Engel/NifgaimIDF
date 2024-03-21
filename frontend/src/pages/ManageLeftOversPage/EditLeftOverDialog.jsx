import React, { useEffect, useState, useCallback } from "react";
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
  Autocomplete,
  TextField,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import Swal from "sweetalert2";
import { deleteLeftOver, updateLeftOver } from "../../utils/api/leftOversApi";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import { getHalalByPrivateNumber } from "../../utils/api/halalsApi";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import Transition from "../../components/TableUtils/Transition";
import PaperComponent from "../../components/TableUtils/PaperComponent";
import { useForm } from "react-hook-form";

const translationDict = {
  fullName: "שם מלא",
  proximity: "קרבה משפחתית",
  city: "עיר",
  address: "כתובת",
  phone: "מספר טלפון",
  isReligious: "דת",
  nifgaimHalalId: "שיוך חלל",
};

const errorDict = {
  len: "אורך",
  isNumeric: "חובה מספר",
};

const EditLeftOverDialog = ({
  openDialog,
  setOpenDialog,
  selectedRow,
  setRows,
  halals,
}) => {
  const [inputValues, setInputValues] = useState({});
  const [phone, setPhone] = useState(selectedRow?.phone || "+972");
  const [selectedHalal, setSelectedHalal] = useState(null);
  const [selectedProximityValue, setSelectedProximityValue] = useState(
    selectedRow.proximity
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
    const fetchHalalsData = async () => {
      try {
        const halal = await getHalalByPrivateNumber(selectedRow.halalId);
        setSelectedHalal(halal);
        setSelectedProximityValue(selectedRow.proximity);
        setPhone(selectedRow.phone);
      } catch (error) {
        console.error("Error fetching halals:", error);
      }
    };

    fetchHalalsData();
  }, [selectedRow.halalId, selectedRow.proximity, selectedRow.phone]);

  const proximityOptions = [
    "אבא",
    "אמא",
    "בן זוג",
    "בת זוג",
    "אח",
    "אחות",
    "בת",
    "בן",
  ];

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = useCallback((column, value) => {
    if (column === "phone") {
      setPhone(value);
    } else if (column === "proximity") {
      setSelectedProximityValue(value);
    }
    setInputValues((prevValues) => ({
      ...prevValues,
      [column]: value,
    }));
  }, []);

  const handleSubmitForm = async () => {
    try {
      // Here you can send inputValues to your backend using a PATCH request

      const updatedLeftOverData = {
        fullName: inputValues.fullName || selectedRow.fullName,
        proximity: inputValues.proximity || selectedRow.proximity,
        city: inputValues.city || selectedRow.city,
        address: inputValues.address || selectedRow.address,
        phone: phone || selectedRow.phone,
        comments: inputValues.comments || selectedRow.comments,
        isReligious:
          inputValues.isReligious === "true" ||
          inputValues.isReligious === true,
        nifgaimHalalId: selectedHalal.id || selectedRow.nifgaimHalalId,
      };
      const updatedLeftOver = await updateLeftOver(
        loggedUserId,
        selectedRow.id,
        updatedLeftOverData
      );

      const updatedLeftOverDataWithHalalId = {
        ...updatedLeftOver,
        halalId: selectedHalal.privateNumber,
        halalFullName: selectedHalal.lastName + " " + selectedHalal.firstName,
      };

      // Then, inside your setRows function, ensure that you include halalId (which now contains nifgaimHalalId)
      setRows((prevRows) =>
        prevRows.map((row) => {
          if (row.id === selectedRow.id) {
            return { ...row, ...updatedLeftOverDataWithHalalId };
          }
          return row;
        })
      );
      Swal.fire({
        title: `שאר "${inputValues.fullName}" עודכן בהצלחה!`,
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
        });
      } else {
        errorsForSwal += `<li>${error}</li>`;
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
      const leftOverName = selectedRow.fullName;

      Swal.fire({
        title: `האם את/ה בטוח/ה שתרצה/י למחוק את השאר ${leftOverName}`,
        text: "פעולה זאת איננה ניתנת לשחזור",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "מחק שאר",
        cancelButtonText: "בטל",
        reverseButtons: true,
        customClass: {
          container: "swal-dialog-custom",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteLeftOver(loggedUserId, selectedRow.id);
            setRows((prevRows) =>
              prevRows.filter((row) => row.id !== selectedRow.id)
            );
            Swal.fire({
              title: `חלל "${leftOverName}" נמחק בהצלחה!`,
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
                  ערוך שאר
                </p>
              </div>
            </DialogTitle>
          </ThemeProvider>
        </CacheProvider>
        <Divider />
        <DialogContent>
          <form>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <InputLabel id="fullName">שם מלא</InputLabel>
              <Input
                defaultValue={selectedRow.fullName || ""}
                {...register("fullName", {
                  required: {
                    value: true,
                    message: "שם מלא שדה חובה",
                  },
                  pattern: {
                    value: /^[a-zA-Z\u05D0-\u05EA]+$/,
                    message: ` שם יכול לכלול רק אותיות `,
                  },
                })}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
              {errors["fullName"] && (
                <p style={{ color: "red" }}>{errors["fullName"].message}</p>
              )}
              <RtlPlugin>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  style={{ marginTop: "20px" }}
                  options={halals}
                  getOptionLabel={(option) =>
                    `${option.privateNumber}: ${option.firstName} ${option.lastName}`
                  }
                  value={selectedHalal}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  } // Customize the equality test
                  {...register("nifgaimHalalId", {
                    validate: () => {
                      if (!selectedHalal) {
                        return "חובה לשייך שאר לחלל מהרשימה";
                      } else {
                        return true;
                      }
                    },
                  })}
                  onChange={(event, newValue) => {
                    setSelectedHalal(newValue);
                    handleInputChange(
                      "nifgaimHalalId",
                      newValue ? newValue.id : ""
                    );
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="שייך חלל" />
                  )}
                />
                {errors["nifgaimHalalId"] && (
                  <p style={{ color: "red" }}>
                    {errors["nifgaimHalalId"].message}
                  </p>
                )}
              </RtlPlugin>
              <InputLabel id="proximity" style={{ marginTop: "20px" }}>
                קרבה משפחתית
              </InputLabel>
              <RtlPlugin>
                <Select
                  labelId="proximity-select-label"
                  id="proximity-select"
                  fullWidth
                  value={selectedProximityValue}
                  style={{
                    direction: "rtl",
                  }}
                  label="קרבה משפחתית"
                  {...register("proximity", {
                    validate: () => {
                      if (!selectedProximityValue) {
                        return "חובה לבחור קרבה משפחתית";
                      } else {
                        return true;
                      }
                    },
                  })}
                  onChange={(e) =>
                    handleInputChange("proximity", e.target.value)
                  }
                >
                  {proximityOptions.map((option, index) => (
                    <MenuItem
                      key={index}
                      value={option}
                      style={{
                        direction: "rtl",
                      }}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors["proximity"] && (
                  <p style={{ color: "red" }}>{errors["proximity"].message}</p>
                )}
              </RtlPlugin>
              <InputLabel id="city" style={{ marginTop: "20px" }}>
                עיר
              </InputLabel>
              <Input
                defaultValue={selectedRow.city || ""}
                {...register("city", {
                  required: {
                    value: true,
                    message: "עיר שדה חובה",
                  },
                })}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
              {errors["city"] && (
                <p style={{ color: "red" }}>{errors["city"].message}</p>
              )}
              <InputLabel id="address" style={{ marginTop: "20px" }}>
                כתובת
              </InputLabel>
              <Input
                defaultValue={selectedRow.address || ""}
                {...register("address", {
                  required: {
                    value: true,
                    message: "כתובת שדה חובה",
                  },
                })}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
              {errors["address"] && (
                <p style={{ color: "red" }}>{errors["address"].message}</p>
              )}
              <InputLabel id="phone" style={{ marginTop: "20px" }}>
                מספר טלפון
              </InputLabel>
              <MuiTelInput
                value={phone}
                excludecountries={["pa"]}
                {...register("phone", {
                  validate: (value) => {
                    // const pattern = /^\+972 \d{2} \d{3} \d{4}$/;
                    if (value.length <= 4) {
                      return "מספר טלפון שדה חובה";
                    }
                    // if (!pattern.test(value)) {
                    //   return "מספר טלפון לא תקין";
                    // }
                    else {
                      return true;
                    }
                  },
                })}
                onChange={(value) => handleInputChange("phone", value)}
              />
              {errors["phone"] && (
                <p style={{ color: "red" }}>{errors["phone"].message}</p>
              )}
              <InputLabel id="isReligious" style={{ marginTop: "20px" }}>
                דתי
              </InputLabel>
              <RadioGroup
                aria-labelledby="booleanSelect"
                name="controlled-radio-buttons-group"
                row
                defaultValue={selectedRow.isReligious.toString()}
                {...register("isReligious", {
                  validate: () => {
                    if (
                      inputValues.isReligious === undefined &&
                      selectedRow.isReligious === undefined
                    ) {
                      return "חובה לבחור";
                    } else {
                      return true;
                    }
                  },
                })}
                onChange={(e) =>
                  handleInputChange("isReligious", e.target.value)
                }
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
              {errors["isReligious"] && (
                <p style={{ color: "red" }}>{errors["isReligious"].message}</p>
              )}
              <InputLabel id={"comments"} style={{ marginTop: "20px" }}>
                הערות
              </InputLabel>
              <Input
                defaultValue={selectedRow.comments || ""}
                onChange={(e) => handleInputChange("comments", e.target.value)}
              />
            </div>
          </form>
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
            <Button onClick={handleCloseDialog}>ביטול</Button>
            <div>
              <Button
                variant="contained"
                style={{ marginLeft: "10px" }}
                onClick={handleSubmit(handleSubmitForm)}
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
};

export default EditLeftOverDialog;
