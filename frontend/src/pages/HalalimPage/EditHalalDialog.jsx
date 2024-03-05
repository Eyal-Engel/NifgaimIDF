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
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
export default function EditHalalDIalog({
  openDialog,
  setOpenDialog,
  selectedRow,
  allDataOfHalalsColumns,
}) {
  const [enums, setEnums] = useState([]);
  const translationDict = {
    id: "מספר זיהוי",
    privateNumber: "מספר פרטי",
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
    nifgaimGraveyardId: "קבר",
    nifgaimCommandId: "פיקוד",
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  function getColumnByName(columnName) {
    return allDataOfHalalsColumns.find(
      (column) => column.column_name === columnName
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      let enumsObject = {};

      if (selectedRow) {
        for (const key of Object.keys(selectedRow)) {
          const column = getColumnByName(key);
          if (column.data_type === "USER-DEFINED") {
            const columnEnums = await getColumnEnums(key);
            if (columnEnums) {
              if (columnEnums) {
                const enumArray = columnEnums.replace(/[{}]/g, "").split(",");
                enumsObject[key] = enumArray;
              } else {
                enumsObject[key] = [];
              }
            }
          } else {
            enumsObject[key] = [];
          }
        }
      }
      setEnums(enumsObject);
    };
    fetchData();
  }, [selectedRow]);

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
            <p style={{ fontSize: "large" }}>עריכת חלל</p>
            <p style={{ fontSize: "large" }}>
              {selectedRow &&
                selectedRow.firstName + " " + selectedRow.lastName}
            </p>
          </div>
        </DialogTitle>
        <Divider></Divider>
        <DialogContent>
          {selectedRow &&
            Object.entries(selectedRow).map(([key, value]) => {
              const column = getColumnByName(key);
              const isTimestamp =
                column.data_type === "timestamp with time zone";
              const isInteger = column.data_type === "integer";
              const isBoolean = column.data_type === "boolean";
              const isUserDefined = column.data_type === "USER-DEFINED";

              // let enums = [];
              // useEffect(async () => {
              //   enums = await getColumnEnums(key);
              // }, []);
              return (
                <div
                  key={key}
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <InputLabel id={key}>
                    {translationDict[key] ? translationDict[key] : key}
                  </InputLabel>
                  {isTimestamp ? (
                    <RtlPlugin
                      style={{
                        margin: "auto",
                        marginTop: "15px",
                      }}
                    >
                      <DatePicker
                        label="תאריך ברירת מחדל"
                        defaultValue={dayjs(value)}
                        sx={{ width: "100%" }}

                        // fullWidth // onChange={handeldefaultValueChange}
                      />
                    </RtlPlugin>
                  ) : isInteger ? (
                    <Input
                      type="number"
                      defaultValue={value}
                      // sx={{ width: "47%" }}
                    />
                  ) : isBoolean ? (
                    <RadioGroup
                      aria-labelledby="booleanSelect"
                      name="controlled-radio-buttons-group"
                      defaultValue={value}
                      // onChange={handeldefaultValueChange}
                      row
                    >
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        sx={{ marginRight: 0 }}
                        label="כן"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="לא"
                      />
                    </RadioGroup>
                  ) : isUserDefined ? (
                    <Select
                      labelId={key}
                      defaultValue={value}
                      // sx={{ width: "47%" }}
                    >
                      {/* Render menu items based on enums state */}
                      {enums[key] &&
                        enums[key].map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                    </Select>
                  ) : (
                    <Input
                      defaultValue={value}
                      // sx={{ width: "47%" }}
                    />
                  )}
                </div>
              );
            })}
        </DialogContent>
        <Divider></Divider>
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
              <Button variant="contained" style={{marginLeft: "10px"}}>שמור שינויים</Button>
              <Button variant="contained" color="error">
                מחיקה
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
