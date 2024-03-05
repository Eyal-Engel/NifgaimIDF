import React, { useEffect, useState } from "react";
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
import { getColumnEnums } from "../../utils/api/halalsApi";

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

export default function CreateHalalDialog({
  openDialog,
  setOpenDialog,
  allDataOfHalalsColumns,
}) {
  const [enums, setEnums] = useState({});

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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
            <p style={{ fontSize: "large" }}>Create Halal</p>
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
                    // fullWidth
                    sx={{ width: "100%" }}
                    // onChange={handeldefaultValueChange}
                  />
                </RtlPlugin>
              ) : column.data_type === "integer" ? (
                <Input
                  type="number"
                  //  sx={{ width: "47%" }}
                />
              ) : column.data_type === "boolean" ? (
                <RadioGroup
                  aria-labelledby="booleanSelect"
                  name="controlled-radio-buttons-group"
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
              ) : column.data_type === "USER-DEFINED" ? (
                <FormControl fullWidth>
                  <InputLabel id={column.column_name}>
                    בחר אחת מהאפשרויות
                  </InputLabel>
                  <Select
                    labelId={column.column_name}
                    //   sx={{ width: "47%" }}
                    label="בחר אחת מהאפשרויות"
                  >
                    {/* Render menu items based on enums state */}
                    {enums[column.column_name] &&
                      enums[column.column_name].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              ) : (
                <Input
                // sx={{ width: "47%" }}
                />
              )}
            </div>
          ))}
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
