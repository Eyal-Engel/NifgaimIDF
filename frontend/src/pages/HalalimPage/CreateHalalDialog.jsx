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
  createTheme,
  ThemeProvider,
} from "@mui/material";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import { DatePicker } from "@mui/x-date-pickers";
import Draggable from "react-draggable";
import { createHalal, getColumnEnums } from "../../utils/api/halalsApi";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import {
  getCommandIdByName,
  getCommandNameById,
} from "../../utils/api/commandsApi";
import {
  getGraveyardById,
  getGraveyardIdByName,
} from "../../utils/api/graveyardsApi";

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
  originalColumns,
  setRows,
  rows,
  commands,
  graveyards,
}) {
  const [enums, setEnums] = useState({});
  const [inputValues, setInputValues] = useState({});
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

  const translationDict = {
    id: "מספר זיהוי",
    privateNumber: "מספר אישי",
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
  // Rearrange allDataOfHalalsColumns to start with objects matching originalColumns
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

  // const handleInputChange = useCallback((column, value) => {
  //   console.log(column, value);
  //   setInputValues((prevValues) => ({
  //     ...prevValues,
  //     [column]: value,
  //   }));

  //   console.log(inputValues);
  // }, []);

  const handleInputChange = useCallback(
    async (column, value) => {
      let v = value;

      try {
        if (column === "nifgaimCommandId") {
          const commandId = await getCommandIdByName(value);
          v = commandId;
        } else if (column === "nifgaimGraveyardId") {
          const graveyardId = await getGraveyardIdByName(value);
          v = graveyardId;
        }
        setInputValues((prevValues) => ({
          ...prevValues,
          [column]: v,
        }));
      } catch (error) {
        console.error("Error:", error);
        // Handle error appropriately, such as displaying an error message
      }

    },
    [setInputValues]
  );

  function removeQuotes(inputString) {
    // Remove the overall quotes from the input string
    inputString = inputString.replace(/^{|"|}$/g, '');

    // Split the input string by commas and remove leading/trailing whitespaces
    const items = inputString.split(',').map((item) => item.trim());

    // Remove double quotes from the first and last character of each item if they are present
    const itemsWithoutQuotes = items.map((item) => {
        if (item.startsWith('"') && item.endsWith('"')) {
            return item.slice(1, -1); // Remove quotes from the beginning and end
        }
        return item;
    });

    // Join the items back into a string and return
    return `{${itemsWithoutQuotes.join(',')}}`;
}

  useEffect(() => {
    const fetchData = async () => {
      let enumsObject = {};
      let result;
      let arrayEnum;

      // Fetch column enums
      for (const column of allDataOfHalalsColumns) {
        if (column.data_type === "USER-DEFINED") {
          const columnEnums = await getColumnEnums(column.column_name);
          if (columnEnums) {
            // const enumArray = columnEnums
            //   .replace(/[{}]/g, "")
            //   .split(",")
            //   .map((item) => item.trim());
            result = removeQuotes(columnEnums);
            arrayEnum = result.slice(1, -1).split(",");
            enumsObject[column.column_name] = arrayEnum;
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
      const { id, halalData } = await createHalal(loggedUserId, inputValues);

      const graveyard = await getGraveyardById(halalData.nifgaimGraveyardId);
      const graveyardName = graveyard.graveyardName;
      const commandName = await getCommandNameById(halalData.nifgaimCommandId);

      // Create a new object with updated values
      const newHalalData = {
        id,
        ...halalData,
        nifgaimGraveyardId: graveyardName,
        nifgaimCommandId: commandName,
      };

      console.log(newHalalData);

      setRows([...rows, newHalalData]);
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
                  הוסף חלל חדש
                </p>
              </div>
            </DialogTitle>
          </ThemeProvider>
        </CacheProvider>
        <Divider />
        <DialogContent>
          {/* Render input fields based on columns */}
          {rearrangedColumns.map((column) => (
            <div
              key={column.column_name}
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {column.column_name === "nifgaimCommandId" ? (
                <div>
                  <InputLabel id={column.column_name}>
                    {translationDict[column.column_name]
                      ? translationDict[column.column_name]
                      : column.column_name}
                  </InputLabel>
                  <Select
                    sx={{ direction: "rtl" }}
                    labelId="command-label"
                    id="command"
                    name="command"
                    defaultValue=""
                    displayEmpty
                    className="resetPasswordInputField"
                    onChange={(e) =>
                      handleInputChange(column.column_name, e.target.value)
                    }
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
              ) : column.column_name === "nifgaimGraveyardId" ? (
                <div>
                  <InputLabel id={column.column_name}>
                    {translationDict[column.column_name]
                      ? translationDict[column.column_name]
                      : column.column_name}
                  </InputLabel>
                  <Select
                    sx={{ direction: "rtl" }}
                    labelId="graveyard-label"
                    id="graveyard"
                    name="graveyard"
                    defaultValue=""
                    displayEmpty
                    className="resetPasswordInputField"
                    onChange={(event) =>
                      handleInputChange(column.column_name, event.target.value)
                    }
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

                  {/* <Select
                    sx={{ direction: "rtl" }}
                    labelId="graveyard-label"
                    id="graveyard"
                    name="graveyard"
                    defaultValue=""
                    displayEmpty
                    className="resetPasswordInputField"
                    onChange={(graveyard) =>
                      handleInputChange(column.column_name, graveyard)
                    }
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
                  </Select> */}
                </div>
              ) : (
                <>
                  <InputLabel id={column.column_name}>
                    {translationDict[column.column_name] || column.column_name}
                  </InputLabel>
                  {column.data_type === "timestamp with time zone" ? (
                    <RtlPlugin
                      style={{
                        margin: "auto",
                        marginTop: "15px",
                      }}
                    >
                      <DatePicker
                        label="תאריך פטירה "
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
                </>
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
