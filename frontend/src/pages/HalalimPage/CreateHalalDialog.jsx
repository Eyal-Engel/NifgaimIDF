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
} from "@mui/material";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import { DatePicker } from "@mui/x-date-pickers";
import Draggable from "react-draggable";
import dayjs from "dayjs";
import { createHalal, getColumnEnums } from "../../utils/api/halalsApi";

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

export default function CreateHalalDialog({
  openDialog,
  setOpenDialog,
  allDataOfHalalsColumns,
}) {
  const [enums, setEnums] = useState({});
  const [inputValues, setInputValues] = useState({});

  console.log("check infinte");

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = useCallback((column, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [column]: value,
    }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let enumsObject = {};

      // Fetch column enums
      for (const column of allDataOfHalalsColumns) {
        if (column.data_type === "USER-DEFINED") {
          const columnEnums = await getColumnEnums(column.column_name);
          if (columnEnums) {
            const enumArray = columnEnums
              .replace(/[{}]/g, "")
              .split(",")
              .map((item) => item.trim());
            enumsObject[column.column_name] = enumArray;
          } else {
            enumsObject[column.column_name] = [];
          }
        }
      }
      setEnums(enumsObject);
    };
    fetchData();
  }, [allDataOfHalalsColumns]);

  const handleSubmit = async () => {
    try {
      // Here you can send inputValues to your backend using a POST request
      console.log("Input values:", inputValues);
      await createHalal(inputValues);
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
            <p style={{ fontSize: "large" }}>הוסף חלל חדש</p>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent>
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
              <InputLabel id={column.column_name}>
                {column.column_name}
              </InputLabel>
              {column.data_type === "timestamp with time zone" ? (
                <RtlPlugin
                  style={{
                    margin: "auto",
                    marginTop: "15px",
                  }}
                >
                  <DatePicker
                    label="תאריך ברירת מחדל"
                    sx={{ width: "100%" }}
                    onChange={(date) =>
                      handleInputChange(column.column_name, date)
                    }
                  />
                </RtlPlugin>
              ) : column.data_type === "integer" ? (
                <Input
                  type="number"
                  onChange={(e) =>
                    handleInputChange(column.column_name, e.target.value)
                  }
                />
              ) : column.data_type === "boolean" ? (
                <RadioGroup
                  aria-labelledby="booleanSelect"
                  name="controlled-radio-buttons-group"
                  row
                  onChange={(e) =>
                    handleInputChange(column.column_name, e.target.value)
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
              ) : column.data_type === "USER-DEFINED" ? (
                <FormControl fullWidth>
                  <InputLabel id={column.column_name}>
                    בחר אחת מהאפשרויות
                  </InputLabel>
                  <MemoizedSelect
                    labelId={column.column_name}
                    label="בחר אחת מהאפשרויות"
                    value={inputValues[column.column_name] || ""}
                    onChange={(e) =>
                      handleInputChange(column.column_name, e.target.value)
                    }
                  >
                    {enums[column.column_name] &&
                      enums[column.column_name].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                  </MemoizedSelect>
                </FormControl>
              ) : (
                <Input
                  onChange={(e) =>
                    handleInputChange(column.column_name, e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleCloseDialog}>ביטול</Button>
          <Button variant="contained" onClick={handleSubmit}>
            צור חלל
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
