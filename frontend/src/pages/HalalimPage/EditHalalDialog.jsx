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
import {
  deleteHalal,
  getColumnEnums,
  getLeftOversByHalalId,
  getSoldierAccompaniedsByHalalId,
} from "../../utils/api/halalsApi";
import Swal from "sweetalert2";
import { getAllCommandsNames } from "../../utils/api/commandsApi";
import { getAllGraveyards } from "../../utils/api/graveyardsApi";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { column, prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { useCallback } from "react";

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
  const [soldierAccompanieds, setSoldierAccompanieds] = useState([]);
  const [leftOvers, setLeftOvers] = useState([]);
  const [inputValues, setInputValues] = useState({});
  // const [selectedCommand, setSelectedCommand] = useState(
  //   selectedRow?.nifgaimCommandId
  // );
  // const [selectedGraveyard, setSelectedGraveyard] = useState(
  //   selectedRow?.nifgaimGraveyardId
  // );

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

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  function getColumnByName(columnName) {
    return allDataOfHalalsColumns.find(
      (column) => column.column_name === columnName
    );
  }

  function formatPhoneNumber(phone) {
    const words = phone.split(" ");
    if (words.length > 0) {
      const firstWord = words[0];
      if (firstWord.length > 1) {
        const lastChar = firstWord.charAt(0);
        words[0] = firstWord.substring(1, firstWord.length) + lastChar;
      }
    }
    const reversedWords = words.reverse().join(" ");
    return <div>{reversedWords}</div>;
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

      console.log(enumsObject);
      setEnums(enumsObject);

      const halalId = selectedRow.id;
      console.log(halalId);
      const soldierAccompaniedsData = await getSoldierAccompaniedsByHalalId(
        halalId
      );
      const LeftOversData = await getLeftOversByHalalId(halalId);

      console.log(soldierAccompaniedsData);
      console.log(LeftOversData);

      setSoldierAccompanieds(soldierAccompaniedsData);
      setLeftOvers(LeftOversData);
    };
    fetchData();
  }, [selectedRow]);

  // const handleInputChange = useCallback((column, value) => {
  //   if (column === "nifgaimCommandId") {
  //     setSelectedCommand(value);
  //   } else if (column === "nifgaimGraveyardId") {
  //     setSelectedGraveyard(value);
  //   }

  //   // else if (column === "proximity") {
  //   //   setSelectedValue(value);
  //   // }
  //   console.log(column, value);

  //   console.log(inputValues);
  //   setInputValues((prevValues) => ({
  //     ...prevValues,
  //     [column]: value,
  //   }));
  // }, []);

  const handleInputChange = useCallback((column, value) => {
    console.log(inputValues);
    console.log(column, value);
    setInputValues((prevValues) => ({
      ...prevValues,
      [column]: value, // Update state object with column name as key and value as value
    }));
  }, []);

  const handleSubmit = async () => {
    try {
      // Here you can send inputValues to your backend using a PATCH request

      // const updatedLeftOver = await updateLeftOver(
      //   loggedUserId,
      //   selectedRow.id,
      //   updatedLeftOverData
      // );

      // const updatedLeftOverDataWithHalalId = {
      //   ...updatedLeftOver,
      //   halalId: selectedHalal.privateNumber,
      //   halalFullName: selectedHalal.lastName + " " + selectedHalal.firstName,
      // };

      // // Then, inside your setRows function, ensure that you include halalId (which now contains nifgaimHalalId)
      // setRows((prevRows) =>
      //   prevRows.map((row) => {
      //     if (row.id === selectedRow.id) {
      //       return { ...row, ...updatedLeftOverDataWithHalalId };
      //     }
      //     return row;
      //   })
      // );

      handleCloseDialog();
    } catch (error) {
      console.error("Error:", error);
      // Handle error appropriately, e.g., show a message to the user
    }
  };

  const handleDeleteClick = (id) => () => {
    try {
      const halalName = selectedRow.firstName + " " + selectedRow.lastName;

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

        {/* check here */}
        <DialogContent>
          {rearrangedColumns.map((column) => {
            const { column_name: key, data_type } = column;
            const value =
              inputValues[key] !== undefined
                ? inputValues[key]
                : selectedRow[key]; // Get value from inputValues if available, otherwise fallback to selectedRow

            console.log(inputValues[key]);
            console.log(value);

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
                      value={value}
                      displayEmpty
                      className="resetPasswordInputField"
                      onChange={(e) => handleInputChange(key, e.target.value)}
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
                      value={value}
                      displayEmpty
                      className="resetPasswordInputField"
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      renderValue={(value) => (value ? value : "בחר בית קברות")} // Render placeholder
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
                    {data_type === "timestamp with time zone" ? (
                      <RtlPlugin
                        style={{
                          margin: "auto",
                          marginTop: "15px",
                        }}
                      >
                        <DatePicker
                          label="תאריך ברירת מחדל"
                          value={dayjs(value)}
                          onChange={(date) => handleInputChange(key, date)}
                          sx={{ width: "100%" }}
                        />
                      </RtlPlugin>
                    ) : data_type === "integer" ? (
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                      />
                    ) : data_type === "boolean" ? (
                      <RadioGroup
                        aria-labelledby="booleanSelect"
                        name="controlled-radio-buttons-group"
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        value={value}
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
                    ) : data_type === "USER-DEFINED" ? (
                      <Select
                        labelId={key}
                        value={`"ערך 1"`}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                      >
                        {enums[key] &&
                          enums[key].map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                      </Select>
                    ) : (
                      <Input
                        value={inputValues[key] || value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
          {/* Code for displaying soldierAccompanieds and leftOvers */}
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
              <Button
                variant="contained"
                onClick={handleSubmit}
                style={{ marginLeft: "10px" }}
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
}
