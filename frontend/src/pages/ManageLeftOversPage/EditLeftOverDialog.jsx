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

const EditLeftOverDialog = ({ openDialog, setOpenDialog, selectedRow }) => {
  const [inputValues, setInputValues] = useState({});
  console.log(selectedRow);
  const [phone, setPhone] = useState(selectedRow?.phone || "+972");

  const [selectedValue, setSelectedValue] = React.useState(
    selectedRow?.proximity || ""
  );
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

    console.log(inputValues, column + ":" + value);
  }, []);

  const handleSubmit = async () => {
    try {
      // Here you can send inputValues to your backend using a POST request
      console.log("Input values:", selectedRow.id, inputValues);
      console.log(inputValues);
      // Call your update function with selectedRow.id and inputValues
      handleCloseDialog();
    } catch (error) {
      console.error("Error:", error);
      // Handle error appropriately, e.g., show a message to the user
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
              value={selectedRow.fullName || ""}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
            />
            <InputLabel id={"city"} style={{ marginTop: "20px" }}>
              עיר
            </InputLabel>
            <Input
              value={selectedRow.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
            <InputLabel id={"address"} style={{ marginTop: "20px" }}>
              כתובת
            </InputLabel>
            <Input
              value={selectedRow.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
            <InputLabel id={"phone"} style={{ marginTop: "20px" }}>
              מספר טלפון
            </InputLabel>
            <MuiTelInput
              defaultCountry={"il"}
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
              value={selectedRow.isReligious.toString()}
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
            <InputLabel id={"comments"} style={{ marginTop: "20px" }}>
              הערות
            </InputLabel>
            <Input
              value={selectedRow.comments || ""}
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
              <Button variant="contained" style={{ marginLeft: "10px" }}>
                שמור שינויים
              </Button>
              <Button variant="contained" color="error">
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
