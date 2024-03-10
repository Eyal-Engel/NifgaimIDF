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
  Paper,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  DialogActions,
  Slide,
  FormControl,
  Autocomplete,
  TextField,
} from "@mui/material";
import Draggable from "react-draggable";
import { MuiTelInput } from "mui-tel-input";
import Swal from "sweetalert2";
import { deleteLeftOver, updateLeftOver } from "../../utils/api/leftOversApi";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import {
  getHalalById,
  getHalalByPrivateNumber,
  getHalals,
} from "../../utils/api/halalsApi";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} sx={{ borderRadius: "10px" }} />
    </Draggable>
  );
}

const EditLeftOverDialog = ({
  openDialog,
  setOpenDialog,
  selectedRow,
  setRows,
}) => {
  const [inputValues, setInputValues] = useState({});
  const [phone, setPhone] = useState(selectedRow?.phone || "+972");
  const [selectedHalal, setSelectedHalal] = useState(null);
  const [selectedValue, setSelectedValue] = useState(selectedRow.proximity);
  const [halals, setHalals] = useState([]);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";

  console.log("check infinte");

  useEffect(() => {
    const fetchHalalsData = async () => {
      //   setLoading(true);

      try {
        const halal = await getHalalByPrivateNumber(selectedRow.halalId);
        setSelectedHalal(halal);
        setSelectedValue(selectedRow.proximity);
        setPhone(selectedRow.phone);

        let halalim = await getHalals();
        halalim.sort((a, b) => a.privateNumber - b.privateNumber);
        setHalals(halalim);

        // setLoading(false);
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
      setSelectedValue(value);
    }
    setInputValues((prevValues) => ({
      ...prevValues,
      [column]: value,
    }));
  }, []);

  const handleSubmit = async () => {
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
        nifgaimHalalId: selectedHalal.id,
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

      handleCloseDialog();
    } catch (error) {
      console.error("Error:", error);
      // Handle error appropriately, e.g., show a message to the user
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
        <DialogTitle>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontSize: "large" }}>ערוך שאר</p>
          </div>
        </DialogTitle>
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
            <InputLabel id={"proximity"} style={{ marginTop: "20px" }}>
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
              onChange={(e) => handleInputChange("proximity", e.target.value)}
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
            <InputLabel id={"city"} style={{ marginTop: "20px" }}>
              עיר
            </InputLabel>
            <Input
              defaultValue={selectedRow.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
            <InputLabel id={"address"} style={{ marginTop: "20px" }}>
              כתובת
            </InputLabel>
            <Input
              defaultValue={selectedRow.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
            <InputLabel id={"phone"} style={{ marginTop: "20px" }}>
              מספר טלפון
            </InputLabel>
            <MuiTelInput
              defaultValue={phone}
              value={phone}
              excludecountries={["pa"]}
              onChange={(value) => handleInputChange("phone", value)}
            />
            <InputLabel id={"isReligious"} style={{ marginTop: "20px" }}>
              דת
            </InputLabel>
            <RadioGroup
              aria-labelledby="booleanSelect"
              name="controlled-radio-buttons-group"
              row
              defaultValue={selectedRow.isReligious.toString()}
              onChange={(e) => handleInputChange("isReligious", e.target.value)}
            >
              <FormControlLabel
                value={"true"}
                control={<Radio />}
                sx={{ marginRight: 0 }}
                label="כן"
              />
              <FormControlLabel
                value={"false"}
                control={<Radio />}
                label="לא"
              />
            </RadioGroup>

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

export default EditLeftOverDialog;
