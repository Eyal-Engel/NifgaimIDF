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
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import { DatePicker } from "@mui/x-date-pickers";
import Draggable from "react-draggable";
import dayjs from "dayjs";
import {
  createHalal,
  getColumnEnums,
  getHalals,
} from "../../utils/api/halalsApi";
import { createLeftOver } from "../../utils/api/leftOversApi";
import { MuiTelInput } from "mui-tel-input";
import Swal from "sweetalert2";

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

const MemoizedSelect = React.memo(Select);

export default function CreateLeftOverDialog({
  openDialog,
  setOpenDialog,
  rows,
  setRows,
}) {
  const [inputValues, setInputValues] = useState({});
  const [phone, setPhone] = useState("+972");
  const [halals, setHalals] = useState([]);
  const [selectedValue, setSelectedValue] = React.useState("");
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
      const newLeftOVer = await createLeftOver(loggedUserId, inputValues);
      const formmatedLeftOver = {
        id: newLeftOVer.id,
        fullName: newLeftOVer.fullName,
        halalId: newLeftOVer.nifgaimHalalId,
        proximity: newLeftOVer.proximity,
        city: newLeftOVer.city,
        address: newLeftOVer.address,
        phone: newLeftOVer.phone,
        comments: newLeftOVer.comments,
        isReligious: newLeftOVer.isReligious,
      };
      console.log(formmatedLeftOver);
      setRows(rows, formmatedLeftOver);
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
      Swal.fire({
        title: `לא ניתן להוסיף את השאר`,
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
  };

  useEffect(() => {
    const fetchHalalsData = async () => {
      //   setLoading(true);

      try {
        let halalim = await getHalals();
        halalim.sort((a, b) => a.privateNumber - b.privateNumber);

        console.log(halalim);

        setHalals(halalim);

        // setLoading(false);
      } catch (error) {
        console.error("Error fetching halals:", error);
      }
    };

    fetchHalalsData();
  }, []);

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
            <p style={{ fontSize: "large" }}>הוסף שאר חדש</p>
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
              onChange={(e) => handleInputChange("fullName", e.target.value)}
            />
            {/* <InputLabel id={"halal"} style={{ marginTop: "20px" }}>
              שיוך חלל
            </InputLabel> */}
            <RtlPlugin>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                style={{ marginTop: "20px" }}
                options={halals} // Assuming halals is the array you mapped before
                getOptionLabel={(option) =>
                  `${option.privateNumber}: ${option.firstName} ${option.lastName}`
                }
                value={
                  halals.find(
                    (halal) => halal.privateNumber === inputValues.halal
                  ) || null
                }
                onChange={(event, newValue) => {
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
            {/* <RtlPlugin>
              <Select
                fullWidth
                labelId="halal-label"
                id="halal-select"
                value={inputValues.halal || ""}
                onChange={(e) => handleInputChange("halfal", e.target.value)}
              >
                {halals.map((halal, index) => (
                  <MenuItem
                    key={index}
                    value={halal.privateNumber}
                    style={{
                      display: "flex",
                      direction: "rtl",
                    }}
                  >
                    <div style={{ marginLeft: "10%" }}>
                      <span style={{ fontSize: "small", color: "grey" }}>
                        שם מלא:
                      </span>
                      {"   "}
                      <span>
                        {halal.firstName} {halal.lastName}
                      </span>
                    </div>
                    {/* <div style={{ display: "flex", flexDirection: "column" }}> */}
            {/* <span style={{ fontSize: "small", color: "grey" }}>
                      מספר אישי:
                    </span>
                    {"   "}
                    <span>{halal.privateNumber}</span>
                    {/* </div> */}
            {/* <div style={{ display: "flex", flexDirection: "column" }}> */}
            {/* </div> */}
            {/* </MenuItem>
                ))}
              </Select>
            </RtlPlugin>   */}
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
              onChange={(e) => handleInputChange("isReligious", e.target.value)}
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                sx={{ marginRight: 0 }}
                label="כן"
              />
              <FormControlLabel value={false} control={<Radio />} label="לא" />
            </RadioGroup>
            <InputLabel id={"comments"} style={{ marginTop: "20px" }}>
              הערות
            </InputLabel>
            <Input
              onChange={(e) => handleInputChange("comments", e.target.value)}
            />
          </div>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleCloseDialog}>ביטול</Button>
          <Button variant="contained" onClick={handleSubmit}>
            צור שאר
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
