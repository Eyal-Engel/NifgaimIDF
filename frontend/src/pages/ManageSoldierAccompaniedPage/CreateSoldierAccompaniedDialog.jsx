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
  ListSubheader,
} from "@mui/material";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import { DatePicker } from "@mui/x-date-pickers";
import Draggable from "react-draggable";
import dayjs from "dayjs";
import {
  createHalal,
  getColumnEnums,
  getHalalByPrivateNumber,
  getHalals,
} from "../../utils/api/halalsApi";
import { createLeftOver } from "../../utils/api/leftOversApi";
import { MuiTelInput } from "mui-tel-input";
import Swal from "sweetalert2";
import { createSoldierAccompanied } from "../../utils/api/soldierAccompaniedsApi";

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

export default function CreateSoldierAccompaniedDialog({
  openDialog,
  setOpenDialog,
  rows,
  setRows,
}) {
  const [inputValues, setInputValues] = useState({});
  const [phone, setPhone] = useState("+972");
  const [halals, setHalals] = useState([]);
  const [rank, setRank] = useState("");
  const [selectedHalal, setSelectedHalal] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";
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
      console.log(inputValues);
      const newLeftOVer = await createSoldierAccompanied(
        loggedUserId,
        inputValues
      );

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
        setHalals(halalim);

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
            <p style={{ fontSize: "large" }}>הוסף נציג חדש</p>
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
                value={selectedHalal}
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
            {/* <Input
              onChange={(e) => handleInputChange("rank", e.target.value)}
            /> */}
            <InputLabel id={"phone"} style={{ marginTop: "20px" }}>
              מספר טלפון
            </InputLabel>
            <MuiTelInput
              defaultCountry={"il"}
              value={phone}
              excludecountries={["pa"]} // Use lowercase prop name
              onChange={(value) => handleInputChange("phone", value)}
            />

            <InputLabel id={"unit"} style={{ marginTop: "20px" }}>
              יחידה
            </InputLabel>
            <Input
              onChange={(e) => handleInputChange("unit", e.target.value)}
            />
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
            צור מלווה
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
