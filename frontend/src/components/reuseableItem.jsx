import React, { useCallback, useEffect, useState } from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { column, prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import {
  Chip,
  FormControlLabel,
  Input,
  Radio,
  RadioGroup,
  useMediaQuery,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import LockIcon from "@mui/icons-material/Lock";
import { IconButton, ThemeProvider, createTheme } from "@mui/material";
import "./reuseableItem.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import RtlPlugin from "./rtlPlugin/RtlPlugin";

const theme = (outerTheme) =>
  createTheme({
    direction: "rtl",
    palette: {
      mode: outerTheme.palette.mode,
    },
  });

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const EditableItem = ({
  itemName,
  itemId,
  handleItemNameChange,
  handleDeleteItem,
  isGraveyard,
  isNewItem,
  isColumn,
  defaultValue,
  isNewColumn,
  columnType,
}) => {
  const [isInEditMode, setIsInEditMode] = useState(isNewItem ? true : false);
  const [editedItemName, setEditedItemName] = useState(itemName);
  const [editedDefaultValue, setEditedDefaultValue] = useState(
    defaultValue || ""
  );

  const [defaultValueFormmated, setDefaultValueFormmated] = useState(
    defaultValue || ""
  );

  // const handleDefaultValue = useCallback(
  //   (defaultValue) => {
  //     let result = defaultValue;

  //     if (
  //       defaultValue === null ||
  //       (typeof defaultValue === "string" &&
  //         columnType !== "BOOLEAN" &&
  //         defaultValue.includes("NULL"))
  //     ) {
  //       console.log(defaultValue);
  //       return "לא הוגדר ערך ברירת מחדל";
  //       // result = null;
  //     } else if (columnType === "BOOLEAN") {
  //       return defaultValue;
  //     } else if (defaultValue.includes("enum_nifgaimHalals_")) {
  //       const startIndex = defaultValue.indexOf("'") + 1; // Find the index of the first single quote
  //       const endIndex = defaultValue.lastIndexOf("'"); // Find the index of the last single quote
  //       return defaultValue.substring(startIndex, endIndex); // Extract the substring between the first and last single quotes
  //     } else if (defaultValue.includes("timestamp with time zone")) {
  //       const formatDate = defaultValue.split("'")[1].split(" ")[0];
  //       return formatDate;
  //     } else if (columnType === "BOOLEAN") {
  //       return defaultValue;
  //     } else if (defaultValue.includes("enum_nifgaimHalals_")) {
  //       const startIndex = defaultValue.indexOf("'") + 1; // Find the index of the first single quote
  //       const endIndex = defaultValue.lastIndexOf("'"); // Find the index of the last single quote
  //       return defaultValue.substring(startIndex, endIndex); // Extract the substring between the first and last single quotes
  //     } else {
  //       if (defaultValue instanceof Date) {
  //         console.log("here is a default value")
  //         const day = String(defaultValue.getDate()).padStart(2, "0");
  //         const month = String(defaultValue.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  //         const year = defaultValue.getFullYear();
  //         result = `${day}/${month}/${year}`;
  //       } else if (
  //         defaultValue.includes("timestamp with time zone") ||
  //         defaultValue.includes("character varying")
  //       ) {
  //         const temp = defaultValue.match(/'([^']+)'/)[1];
  //         result = temp.substring(0, 10);
  //         // result = `${day}/${month}/${year}`;
  //       }
  //     }
  //     return result;
  //   },
  //   [columnType]
  // );

  // useEffect(() => {
  //   if (isColumn) {
  //     const temp = handleDefaultValue(editedDefaultValue);
  //     setDefaultValueFormmated(temp);
  //   }
  // }, [editedDefaultValue, handleDefaultValue, isColumn]);

  const formatDateToString = (dayjsObject) => {
    console.log(dayjsObject);
    if (!dayjsObject || !dayjsObject.isValid()) {
      return "Invalid dayjs object";
    }

    // Format the date as DD/MM/YYYY
    const formattedDate = dayjsObject.format("DD/MM/YYYY");

    return formattedDate;
  };

  const handleEditClick = () => {
    setIsInEditMode(true);
  };

  const handleSaveClick = () => {
    setIsInEditMode(false);

    if (isColumn) {
      handleItemNameChange(
        itemId,
        editedItemName,
        columnType,
        editedDefaultValue
      );
    } else {
      handleItemNameChange(itemId, editedItemName);
    }
  };

  const handleDeleteClick = () => {
    // Call the delete function with the index of the item to delete
    handleDeleteItem(itemId, itemName);
    // You may also want to handle any additional logic, like making an API call to delete the item.
  };

  const handleCancelClick = () => {
    setIsInEditMode(false);
  };

  const handleInputChange = (e) => {
    setEditedItemName(e.target.value);
  };

  const handleInputDefaultValueChange = (e) => {
    if (columnType === "DATE") {
      setEditedDefaultValue(formatDateToString(e));
    } else {
      setEditedDefaultValue(e.target.value);
    }
  };

  const isScreenSmall = useMediaQuery("(max-width:850px)");

  if (columnType === "DATE") {
    console.log(editedDefaultValue);
    console.log(dayjs(editedDefaultValue, "D/M/YYYY"));
  }
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
        borderRadius: "10px",
        boxShadow: "2px 2px 2px 1px rgb(0 0 0 / 20%)",
        padding: "10px",
      }}
    >
      <div className="cardContent">
        {!isInEditMode ? (
          <Typography
            sx={{
              textAlign: "end",
              padding: "10px",
            }}
            variant="h6"
            component="div"
          >
            {itemName}
          </Typography>
        ) : (
          <Input
            type="text"
            value={editedItemName}
            onChange={handleInputChange}
            autoFocus
            sx={{
              fontSize: "1.2rem",
              padding: "0px 8px",
              margin: "10px",
              direction: "rtl",
            }}
          />
        )}
        {isColumn && (
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <FormControl
                className="selectTypeOfColumn"
                sx={{
                  m: 1,
                  // width: "15%",
                  zIndex: 0,
                }}
                size="small"
              >
                <InputLabel id="columnType">סוג</InputLabel>
                <Select
                  dir="rtl"
                  labelId="columnType"
                  id="columnType"
                  value={columnType}
                  label="סוג"
                  disabled
                >
                  <MenuItem
                    dir="rtl"
                    value={columnType}
                    selected={columnType.includes("select")}
                  >
                    בחירה
                  </MenuItem>
                  <MenuItem
                    dir="rtl"
                    value="uuid"
                    selected={columnType === "UUID"}
                  >
                    מספר יחודי
                  </MenuItem>
                  <MenuItem
                    dir="rtl"
                    value="STRING"
                    selected={columnType === "STRING"}
                  >
                    טקסט
                  </MenuItem>

                  <MenuItem
                    dir="rtl"
                    value="DATE"
                    selected={columnType === "DATE"}
                  >
                    תאריך
                  </MenuItem>

                  <MenuItem
                    dir="rtl"
                    value="ENUM"
                    selected={columnType === "ENUM"}
                  >
                    בחירה
                  </MenuItem>

                  <MenuItem
                    dir="rtl"
                    value="BOOLEAN"
                    selected={columnType === "BOOLEAN"}
                  >
                    כן/לא
                  </MenuItem>

                  <MenuItem
                    dir="rtl"
                    value="INTEGER"
                    selected={columnType === "INTEGER"}
                  >
                    מספר
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl
                className="selectDefaultValueOfColumn"
                sx={{
                  m: 1,
                  // width: "20%",
                  minWidth: "7rem",
                  zIndex: 0,
                }}
                size="small"
              >
                <InputLabel
                  id="defaultValue"
                  sx={{
                    background: "white",
                    paddingRight: "5px",
                    paddingLeft: "5px",
                    marginTop: "0px",
                    fontSize: "15px",
                  }}
                >
                  ערך ברירת מחדל
                </InputLabel>
                {!isInEditMode ? (
                  <Select
                    dir="rtl"
                    value={editedDefaultValue}
                    disabled
                    sx={{ textAlign: "left" }}
                  >
                    <MenuItem
                      dir="rtl"
                      value={editedDefaultValue}
                      selected={editedDefaultValue !== null}
                    >
                      {editedDefaultValue}
                    </MenuItem>
                  </Select>
                ) : (
                  <>
                    {columnType === "STRING" && (
                      <Input
                        type="text"
                        value={editedDefaultValue}
                        onChange={handleInputDefaultValueChange}
                        style={{
                          // width: "30%",
                          fontSize: "1.2rem",
                          padding: "8px",
                          margin: "10px",
                          direction: "rtl",
                        }}
                      />
                    )}
                    {columnType === "INTEGER" && (
                      <Input
                        type="number"
                        value={editedDefaultValue}
                        onChange={handleInputDefaultValueChange}
                        style={{
                          // width: "30%",
                          fontSize: "1.2rem",
                          padding: "8px",
                          margin: "10px",
                          direction: "rtl",
                        }}
                      />
                    )}
                    {columnType === "DATE" && (
                      <RtlPlugin>
                        <DatePicker
                          format="D/M/YYYY"
                          value={dayjs(editedDefaultValue, "D/M/YYYY")}
                          onChange={handleInputDefaultValueChange}
                        />
                      </RtlPlugin>
                    )}
                    {columnType === "BOOLEAN" && (
                      <FormControl
                        sx={{
                          // width: "90%",
                          marginTop: "10px",
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "center",
                        }}
                      >
                        <RadioGroup
                          aria-labelledby="booleanSelect"
                          name="controlled-radio-buttons-group"
                          value={editedDefaultValue} // Convert boolean to string
                          onChange={handleInputDefaultValueChange}
                          row
                        >
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="כן"
                          />
                          <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="לא"
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  </>
                )}
              </FormControl>
              {columnType === "ENUM" && (
                <FormControl
                  className="selectEnums"
                  sx={{
                    m: 1,
                    width: "20%",
                    zIndex: 0,
                  }}
                  size="small"
                >
                  <Select
                    labelId="defaultValue"
                    id="defaultValue-select"
                    multiple
                    disabled
                    value={["value1", "value2", "value3"]}
                    renderValue={(selected) => (
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            style={{ margin: 2 }}
                          />
                        ))}
                      </div>
                    )}
                    sx={{
                      background: "white",
                      paddingRight: "5px",
                      paddingLeft: "5px",
                      marginTop: "0px",
                      fontSize: "15px",
                    }}
                  >
                    <MenuItem value="option1">Option 1</MenuItem>
                    <MenuItem value="option2">Option 2</MenuItem>
                    <MenuItem value="option3">Option 3</MenuItem>
                  </Select>
                </FormControl>
              )}
            </ThemeProvider>
          </CacheProvider>
        )}
      </div>
      <CardActions
        className={
          isGraveyard
            ? "actionGraveyardItemButton"
            : isColumn
            ? "actionColumnItemButtons"
            : "actionCommandItemButtons"
        }
      >
        {!isNewColumn &&
          !isInEditMode &&
          (isScreenSmall ? (
            <IconButton>
              <DeleteIcon color="error" />
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
            >
              מחק
            </Button>
          ))}
        {isNewColumn &&
          !isInEditMode &&
          (isScreenSmall ? (
            <IconButton>
              <SaveIcon color="primary" />
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<LockIcon />}
              // sx={{ marginRight: "46px" }}
            >
              עמודה קבועה
            </Button>
          ))}
        {!isNewColumn &&
          !isInEditMode &&
          (isScreenSmall ? (
            <IconButton onClick={handleEditClick} color="primary">
              <EditIcon />
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEditClick}
            >
              עריכה
            </Button>
          ))}
        {!isNewColumn &&
          isInEditMode &&
          (isScreenSmall ? (
            <IconButton onClick={handleSaveClick}>
              <SaveIcon color="success" />
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              color="success"
              startIcon={<SaveIcon />}
              onClick={handleSaveClick}
            >
              שמור
            </Button>
          ))}
        {!isNewColumn &&
          isInEditMode &&
          (isScreenSmall ? (
            <IconButton onClick={handleCancelClick}>
              <CancelIcon color="error" />
            </IconButton>
          ) : (
            <Button
              color="error"
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancelClick}
            >
              בטל
            </Button>
          ))}
      </CardActions>
    </Card>
  );
};

export default EditableItem;
