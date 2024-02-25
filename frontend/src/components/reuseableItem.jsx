import React, { useState } from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { useMediaQuery } from "@mui/material";
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
import { IconButton, ThemeProvider, createTheme } from "@mui/material";
import "./reuseableItem.css";
import { getOriginalColumns } from "../utils/api/halalsApi";
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
  isNewColumn,
  columnType,
}) => {
  const [isInEditMode, setIsInEditMode] = useState(isNewItem ? true : false);
  const [editedItemName, setEditedItemName] = useState(itemName);
  const [typeOfColumn, setTypeOfColumn] = useState(columnType);

  const handleTypeOfColumnChange = (event) => {
    setTypeOfColumn(event.target.value);
  };

  const handleEditClick = () => {
    setIsInEditMode(true);
  };

  const handleSaveClick = () => {
    setIsInEditMode(false);
    handleItemNameChange(itemId, editedItemName);
    // Handle saving the editedItemName, e.g., make an API call.
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

  const isScreenSmall = useMediaQuery("(max-width:650px)");

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
      {!isInEditMode ? (
        <Typography
          sx={{
            // textAlign: isGraveyard ? "end" : "start",
            textAlign: "end",
            padding: "10px",
            width: isColumn ? "30%" : "75%",
          }}
          variant="h6"
          component="div"
        >
          {itemName}
        </Typography>
      ) : (
        <input
          type="text"
          value={editedItemName}
          onChange={handleInputChange}
          autoFocus
          style={{
            width: "30%",
            fontSize: "1.2rem",
            padding: "8px",
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
                width: "15%",
                zIndex: 0,
              }}
              size="small"
            >
              <InputLabel id="columnType">סוג</InputLabel>
              <Select
                dir="rtl"
                labelId="columnType"
                id="columnType"
                value={typeOfColumn}
                label="סוג"
                onChange={handleTypeOfColumnChange}
                disabled
              >
                <MenuItem
                  dir="rtl"
                  value={"uuid"}
                  selected={typeOfColumn === "uuid"}
                >
                  מספר יחודי
                </MenuItem>
                <MenuItem
                  dir="rtl"
                  value={"character varying"}
                  selected={typeOfColumn === "character varying"}
                >
                  טקסט
                </MenuItem>
                <MenuItem
                  dir="rtl"
                  value={"timestamp with time zone"}
                  selected={typeOfColumn === "timestamp with time zone"}
                >
                  תאריך
                </MenuItem>
                <MenuItem
                  dir="rtl"
                  value={"USER-DEFINED"}
                  selected={typeOfColumn === "USER-DEFINED"}
                >
                  בחירה
                </MenuItem>
                <MenuItem
                  dir="rtl"
                  value={"boolean"}
                  selected={typeOfColumn === "boolean"}
                >
                  כן/לא
                </MenuItem>
                <MenuItem
                  dir="rtl"
                  value={"integer"}
                  selected={typeOfColumn === "integer"}
                >
                  מספר
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl
              className="selectTypeOfColumn"
              sx={{
                m: 1,
                width: "20%",
                zIndex: 0,
              }}
              size="small"
            >
              <InputLabel
                id="defaultValue"
                sx={{
                  background: "white",
                  paddingRight: "5px",
                }}
              >
                ערך ברירת מחדל
              </InputLabel>
              <Select
                dir="rtl"
                labelId="columnType"
                id="columnType"
                value={typeOfColumn}
                label="סוג"
                onChange={handleTypeOfColumnChange}
                disabled
              >
                <MenuItem
                  dir="rtl"
                  value={"uuid"}
                  selected={typeOfColumn === "uuid"}
                >
                  ערך ממש ממש ארוך רצח
                </MenuItem>
              </Select>
            </FormControl>
          </ThemeProvider>
        </CacheProvider>
      )}
      <CardActions
        className={
          isGraveyard ? "actionGraveyardItemButton" : "actionCommandItemButtons"
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
            <Button variant="outlined" color="primary" startIcon={<SaveIcon />}>
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
