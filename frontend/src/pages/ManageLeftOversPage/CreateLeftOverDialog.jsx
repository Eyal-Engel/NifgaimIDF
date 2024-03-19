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
  FormControl,
  Autocomplete,
  TextField,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import { getHalalByPrivateNumber, getHalals } from "../../utils/api/halalsApi";
import { createLeftOver } from "../../utils/api/leftOversApi";
import { MuiTelInput } from "mui-tel-input";
import Swal from "sweetalert2";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import PaperComponent from "../../components/TableUtils/PaperComponent";
import Transition from "../../components/TableUtils/Transition";
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

export default function CreateLeftOverDialog({
  openDialog,
  setOpenDialog,
  rows,
  setRows,
  halals,
}) {
  const [inputValues, setInputValues] = useState({});
  const [phone, setPhone] = useState("+972");
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedHalal, setSelectedHalal] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";
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

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = useCallback((column, value) => {
    if (column === "phone") {
      setPhone(value);
    } else if (column === "proximity") {
      setSelectedValue(value);
    }
    setInputValues((prevValues) => ({
      ...prevValues,
      [column]: value,
    }));
  }, []);

  const handleSubmitForm = async () => {
    try {
      const newLeftOVer = await createLeftOver(loggedUserId, inputValues);

      const formmatedLeftOver = {
        ...newLeftOVer,
        halalId: selectedHalal.privateNumber,
        halalFullName: selectedHalal.lastName + " " + selectedHalal.firstName,
      };
      setRows([...rows, formmatedLeftOver]);
      Swal.fire({
        title: `שאר "${inputValues.fullName}" נוסף בהצלחה!`,
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
        title: `לא ניתן להוסיף את השאר`,
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

  useEffect(() => {
    const fetchHalalsData = async () => {
      //   setLoading(true);

      try {
        if (inputValues.halalId) {
          const halal = await getHalalByPrivateNumber(inputValues.halalId);
          setSelectedHalal(halal);
        }

        // setLoading(false);
      } catch (error) {
        console.error("Error fetching halals:", error);
      }
    };

    fetchHalalsData();
  }, [inputValues.halalId]);

  console.log("fuck");
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
                  הוסף שאר חדש
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
              <>
                <InputLabel id="fullName">שם מלא</InputLabel>
                <Input
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
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                />
                {errors["fullName"] && (
                  <p style={{ color: "red" }}>{errors["fullName"].message}</p>
                )}
              </>
              <RtlPlugin>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  style={{ marginTop: "20px" }}
                  options={halals} // Assuming halals is the array you mapped before
                  getOptionLabel={(option) =>
                    `${option.privateNumber}: ${option.firstName} ${option.lastName}`
                  }
                  value={selectedHalal}
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
                    setSelectedHalal(newValue); // Update the selectedHalal state
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

              <RtlPlugin>
                <FormControl fullWidth style={{ marginTop: "20px" }}>
                  <InputLabel id="demo-simple-select-label">
                    קרבה משפחתית
                  </InputLabel>

                  <Select
                    labelId="proximity-select-label"
                    id="proximity-select"
                    fullWidth
                    value={selectedValue}
                    style={{
                      direction: "rtl",
                    }}
                    label="קרבה משפחתית"
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
                </FormControl>
              </RtlPlugin>
              <InputLabel id={"city"} style={{ marginTop: "20px" }}>
                עיר
              </InputLabel>
              <Input
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
              <InputLabel id={"address"} style={{ marginTop: "20px" }}>
                כתובת
              </InputLabel>
              <Input
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
              <InputLabel id={"phone"} style={{ marginTop: "20px" }}>
                מספר טלפון
              </InputLabel>
              <MuiTelInput
                defaultCountry={"il"}
                value={phone}
                excludecountries={["pa"]} // Use lowercase prop name
                onChange={(value) => handleInputChange("phone", value)}
              />

              <InputLabel id={"isReligious"} style={{ marginTop: "20px" }}>
                דת
              </InputLabel>
              <RadioGroup
                aria-labelledby="booleanSelect"
                name="controlled-radio-buttons-group"
                row
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
              <InputLabel id={"comments"} style={{ marginTop: "20px" }}>
                הערות
              </InputLabel>
              <Input
                onChange={(e) => handleInputChange("comments", e.target.value)}
              />
            </div>
          </form>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleCloseDialog}>ביטול</Button>
          <Button variant="contained" onClick={handleSubmit(handleSubmitForm)}>
            צור שאר
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
