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
  createTheme,
  ThemeProvider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import { DatePicker } from "@mui/x-date-pickers";
import Draggable from "react-draggable";
import dayjs from "dayjs";
import { deleteHalal, getColumnEnums } from "../../utils/api/halalsApi";
import Swal from "sweetalert2";
import { getAllCommandsNames } from "../../utils/api/commandsApi";
import { getAllGraveyards } from "../../utils/api/graveyardsApi";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { column, prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

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
  originalColumns,
  setRows,
  rows,
  commands,
  graveyards,
}) {
  const [enums, setEnums] = useState([]);

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
  console.log(selectedRow);
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
    nifgaimGraveyardId: "בית קברות",
    nifgaimCommandId: "פיקוד",
  };

  const rearrangedColumns = [
    ...originalColumns.map((col) =>
      allDataOfHalalsColumns.find((item) => item.column_name === col)
    ),
    ...allDataOfHalalsColumns.filter(
      (item) => !originalColumns.includes(item.column_name)
    ),
  ].filter((column) => column.column_name !== "id"); // Filter out the "id" column

  console.log("check infinte");

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

  const handleDeleteClick = (id) => () => {
    try {
      const halalName = selectedRow.firstNaame + " " + selectedRow.lastName;

      Swal.fire({
        title: `האם את/ה בטוח/ה שתרצה/י למחוק החלל ${halalName}`,
        text: "פעולה זאת איננה ניתנת לשחזור",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "מחק חלל",
        cancelButtonText: "בטל",
        reverseButtons: true,
        customClass: {
          container: "swal-dialog-custom",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteHalal(loggedUserId, selectedRow.id);
            setRows((prevRows) =>
              prevRows.filter((row) => row.id !== selectedRow.id)
            );
            Swal.fire({
              title: `חלל "${halalName}" נמחק בהצלחה!`,
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
                  עריכת חלל
                </p>
                <p
                  style={{
                    fontSize: "large",
                    color: theme.palette.secondary.main,
                  }}
                >
                  {selectedRow &&
                    selectedRow.lastName + " " + selectedRow.firstName}
                </p>
              </div>
            </DialogTitle>{" "}
          </ThemeProvider>
        </CacheProvider>
        <Divider></Divider>
        <DialogContent>
          {rearrangedColumns.map((column) => {
            const { column_name: key, data_type } = column;
            const value = selectedRow[key];
            const isTimestamp = data_type === "timestamp with time zone";
            const isInteger = data_type === "integer";
            const isBoolean = data_type === "boolean";
            const isUserDefined = data_type === "USER-DEFINED";

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
                {key === "nifgaimCommandId" ? (
                  <div>
                    <InputLabel id={key}>
                      {translationDict[key] ? translationDict[key] : key}
                    </InputLabel>
                    <Select
                      sx={{ direction: "rtl" }}
                      labelId="command-label"
                      id="command"
                      name="command"
                      defaultValue=""
                      displayEmpty
                      className="resetPasswordInputField"
                      renderValue={(value) => (value ? value : "פיקוד")} // Render placeholder
                    >
                      <MenuItem sx={{ direction: "rtl" }} value="" disabled>
                        פיקוד
                      </MenuItem>
                      {commands.map((command) => (
                        <MenuItem
                          sx={{ direction: "rtl" }}
                          key={command}
                          value={command}
                        >
                          {command}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                ) : key === "nifgaimGraveyardId" ? (
                  <div>
                    <InputLabel id={key}>
                      {translationDict[key] ? translationDict[key] : key}
                    </InputLabel>
                    <Select
                      sx={{ direction: "rtl" }}
                      labelId="graveyard-label"
                      id="graveyard"
                      name="graveyard"
                      defaultValue=""
                      displayEmpty
                      className="resetPasswordInputField"
                      renderValue={
                        (value) => (value ? value : "בחר בית קברות") // Render placeholder
                      }
                    >
                      <MenuItem sx={{ direction: "rtl" }} value="" disabled>
                        בחר בית קברות
                      </MenuItem>
                      {graveyards.map((graveyard) => (
                        <MenuItem
                          sx={{ direction: "rtl" }}
                          key={graveyard.id}
                          value={graveyard.graveyardName}
                        >
                          {graveyard.graveyardName}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                ) : (
                  <>
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
                        />
                      </RtlPlugin>
                    ) : isInteger ? (
                      <Input type="number" defaultValue={value} />
                    ) : isBoolean ? (
                      <RadioGroup
                        aria-labelledby="booleanSelect"
                        name="controlled-radio-buttons-group"
                        defaultValue={value}
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
                      <Select labelId={key} defaultValue={value}>
                        {enums[key] &&
                          enums[key].map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                      </Select>
                    ) : (
                      <Input defaultValue={value} />
                    )}
                  </>
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
              <Button variant="contained" style={{ marginLeft: "10px" }}>
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
}
