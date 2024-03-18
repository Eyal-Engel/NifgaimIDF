import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  ThemeProvider,
  Input,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  createTheme,
  Autocomplete,
  TextField,
  ListSubheader,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import Swal from "sweetalert2";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import { getHalalByPrivateNumber, getHalals } from "../../utils/api/halalsApi";
import {
  deleteSoldierAccompanied,
  updateSoldierAccompanied,
} from "../../utils/api/soldierAccompaniedsApi";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import Transition from "../../components/TableUtils/Transition";
import PaperComponent from "../../components/TableUtils/PaperComponent";

const translationDict = {
  fullName: "שם מלא",
  privateNumber: "מספר אישי",
  rank: "דרגה",
  unit: "יחידה",
  phone: "מספר טלפון",
  nifgaimHalalId: "שיוך חלל",
};

const errorDict = {
  len: "אורך",
  isNumeric: "חובה מספר",
};

const EditSoldierAccompaniedDialog = ({
  openDialog,
  setOpenDialog,
  selectedRow,
  setRows,
  halals,
}) => {
  const [inputValues, setInputValues] = useState({});
  const [phone, setPhone] = useState(selectedRow?.phone || "+972");
  const [selectedHalal, setSelectedHalal] = useState(null);
  // const [selectedValue, setSelectedValue] = useState(selectedRow.proximity);
  const [rank, setRank] = useState("");

  const ranksOptions = [
    // category: חובה
    `טירון`,
    `טוראי`,
    `רב"ט`,
    `סמל`,
    `סמ"ר`,
    // category: נגדים
    `רס"ל`,
    `רס"ר`,
    `רס"מ`,
    `רס"ב`,
    `רנ"ג`,
    // category: קצינים
    `סג"ם`,
    `סגן`,
    `סרן`,
    `רס"ן`,
    `סא"ל`,
    `אל"ם`,
    `תא"ל`,
    `אלוף`,
    `רא"ל`,
  ];
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
      //   setLoading(true);

      try {
        const halal = await getHalalByPrivateNumber(selectedRow.halalId);
        setSelectedHalal(halal);
        setRank(selectedRow.rank);
        setPhone(selectedRow.phone);

        // setLoading(false);
      } catch (error) {
        console.error("Error fetching halals:", error);
      }
    };

    fetchHalalsData();
  }, [
    selectedRow.halalId,
    selectedRow.proximity,
    selectedRow.phone,
    selectedRow.rank,
  ]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = useCallback((column, value) => {
    if (column === "phone") {
      setPhone(value);
    } else if (column === "rank") {
      setRank(value);
    }
    setInputValues((prevValues) => ({
      ...prevValues,
      [column]: value,
    }));
  }, []);

  const handleSubmit = async () => {
    try {
      // Here you can send inputValues to your backend using a PATCH request

      const updatedSoldierAccompaniedsData = {
        fullName: inputValues.fullName || selectedRow.fullName,
        privateNumber: inputValues.privateNumber || selectedRow.privateNumber,
        rank: inputValues.rank || selectedRow.rank,
        phone: phone || selectedRow.phone,
        unit: inputValues.unit || selectedRow.unit,
        comments: inputValues.comments || selectedRow.comments,
        nifgaimHalalId: selectedHalal.id,
        // nifgaimHalalId: "3ee1ea11-6e33-4845-b9ad-76ad1957551d",
      };

      const updatedSoldierAccompanieds = await updateSoldierAccompanied(
        loggedUserId,
        selectedRow.id,
        updatedSoldierAccompaniedsData
      );

      const updatedSoldierAccompaniedsDataWithHalalId = {
        ...updatedSoldierAccompanieds,
        halalId: selectedHalal.privateNumber,
        halalFullName: selectedHalal.lastName + " " + selectedHalal.firstName,
      };

      // Then, inside your setRows function, ensure that you include halalId (which now contains nifgaimHalalId)
      setRows((prevRows) =>
        prevRows.map((row) => {
          if (row.id === selectedRow.id) {
            return { ...row, ...updatedSoldierAccompaniedsDataWithHalalId };
          }
          return row;
        })
      );
      Swal.fire({
        title: `מלווה "${inputValues.fullName}" עודכן בהצלחה!`,
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
        title: `לא ניתן לעדכן את המלווה`,
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
        title: `האם את/ה בטוח/ה שתרצה/י למחוק את המלווה ${leftOverName}`,
        text: "פעולה זאת איננה ניתנת לשחזור",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "מחק מלווה",
        cancelButtonText: "בטל",
        reverseButtons: true,
        customClass: {
          container: "swal-dialog-custom",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteSoldierAccompanied(loggedUserId, selectedRow.id);
            setRows((prevRows) =>
              prevRows.filter((row) => row.id !== selectedRow.id)
            );
            Swal.fire({
              title: `נציג "${leftOverName}" נמחק בהצלחה!`,
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
              title: `לא ניתן למחוק את הנציג`,
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
                  ערוך מלווה
                </p>
              </div>
            </DialogTitle>
          </ThemeProvider>
        </CacheProvider>
        <Divider />
        <DialogContent>
          {/* Render input fields based on columns */}
          <div
            key="מספר אישי"
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <InputLabel id={"fullName"}>שם מלא</InputLabel>
            <Input
              defaultValue={selectedRow.fullName || ""}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
            />
            <RtlPlugin>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                style={{ marginTop: "20px" }}
                options={halals}
                getOptionLabel={(option) =>
                  `${option.privateNumber}: ${option.firstName} ${option.lastName}`
                }
                isOptionEqualToValue={(option, value) => option.id === value.id} // Customize the equality test
                value={selectedHalal} // Set the value prop instead of defaultValue
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
            </RtlPlugin>
            <InputLabel id={"privateNumber"} style={{ marginTop: "20px" }}>
              מספר אישי
            </InputLabel>
            <Input
              defaultValue={selectedRow.privateNumber || ""}
              onChange={(e) =>
                handleInputChange("privateNumber", e.target.value)
              }
            />
            <InputLabel id={"rank"} style={{ marginTop: "20px" }}>
              דרגה
            </InputLabel>
            <RtlPlugin>
              <Select
                value={rank}
                onChange={(e) => handleInputChange("rank", e.target.value)}
                style={{ direction: "rtl", width: "100%", marginTop: "8px" }}
              >
                <MenuItem disabled>
                  <ListSubheader sx={{ textAlign: "right" }}>
                    חובה
                  </ListSubheader>
                </MenuItem>
                {ranksOptions.slice(0, 5).map((option) => (
                  <MenuItem key={option} value={option}>
                    <div style={{ textAlign: "right" }}>{option}</div>
                  </MenuItem>
                ))}
                <MenuItem disabled>
                  <ListSubheader>נגדים</ListSubheader>
                </MenuItem>
                {ranksOptions.slice(5, 11).map((option) => (
                  <MenuItem key={option} value={option}>
                    <div style={{ textAlign: "right" }}>{option}</div>
                  </MenuItem>
                ))}
                <MenuItem disabled>
                  <ListSubheader>קצינים</ListSubheader>
                </MenuItem>
                {ranksOptions.slice(11).map((option) => (
                  <MenuItem key={option} value={option}>
                    <div style={{ textAlign: "right" }}>{option}</div>
                  </MenuItem>
                ))}
              </Select>
            </RtlPlugin>
            <InputLabel id={"phone"} style={{ marginTop: "20px" }}>
              מספר טלפון
            </InputLabel>
            <MuiTelInput
              value={phone}
              excludecountries={["pa"]}
              onChange={(value) => handleInputChange("phone", value)}
            />
            <InputLabel id={"unit"} style={{ marginTop: "20px" }}>
              יחידה
            </InputLabel>
            <Input
              defaultValue={selectedRow.unit || ""}
              onChange={(e) => handleInputChange("unit", e.target.value)}
            />
            <InputLabel id={"comments"} style={{ marginTop: "20px" }}>
              הערות
            </InputLabel>
            <Input
              defaultValue={selectedRow.comments || ""}
              onChange={(e) => handleInputChange("comments", e.target.value)}
            />
          </div>
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
                onClick={handleSubmit}
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

export default EditSoldierAccompaniedDialog;
