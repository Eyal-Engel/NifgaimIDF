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
import EditSelectDialog from "./EditSelectDialog";
import IntegerTypeItem from "./manageColumns/IntegerTypeItem";
import StringTypeItem from "./manageColumns/StringTypeItem";
import BooleanTypeItem from "./manageColumns/BooleanTypeItem";
import DateTypeItem from "./manageColumns/DateTypeItem";
import EnumTypeItem from "./manageColumns/EnumTypeItem";

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
  enumValues,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isInEditMode, setIsInEditMode] = useState(isNewItem ? true : false);

  const [editedItemName, setEditedItemName] = useState(itemName);
  const [editedDefaultValue, setEditedDefaultValue] = useState(
    defaultValue || ""
  );

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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
    if (columnType === "ENUM") {
      setOpenDialog(true);
    } else {
      setIsInEditMode(true);
    }
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

  const handelSelectColumnSaved = (
    newColumnName,
    columnType,
    defaultValue,
    enumValues
  ) => {
    console.log(newColumnName, columnType, defaultValue, enumValues);

    handleItemNameChange(
      itemId,
      newColumnName,
      columnType,
      defaultValue,
      enumValues
    );
    setOpenDialog(false);
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

  const isScreenSmall = useMediaQuery("(max-width:1000px)");

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
        {columnType === "INTEGER" && (
          <IntegerTypeItem
            isInEditMode={isInEditMode}
            itemName={itemName}
            editedItemName={editedItemName}
            handleInputChange={handleInputChange}
            columnType={columnType}
            editedDefaultValue={editedDefaultValue}
            handleInputDefaultValueChange={handleInputDefaultValueChange}
          />
        )}
        {columnType === "STRING" && (
          <StringTypeItem
            isInEditMode={isInEditMode}
            itemName={itemName}
            editedItemName={editedItemName}
            handleInputChange={handleInputChange}
            columnType={columnType}
            editedDefaultValue={editedDefaultValue}
            handleInputDefaultValueChange={handleInputDefaultValueChange}
          />
        )}
        {columnType === "BOOLEAN" && (
          <BooleanTypeItem
            isInEditMode={isInEditMode}
            itemName={itemName}
            editedItemName={editedItemName}
            handleInputChange={handleInputChange}
            columnType={columnType}
            editedDefaultValue={editedDefaultValue}
            handleInputDefaultValueChange={handleInputDefaultValueChange}
          />
        )}
        {columnType === "DATE" && (
          <DateTypeItem
            isInEditMode={isInEditMode}
            itemName={itemName}
            editedItemName={editedItemName}
            handleInputChange={handleInputChange}
            columnType={columnType}
            editedDefaultValue={editedDefaultValue}
            handleInputDefaultValueChange={handleInputDefaultValueChange}
          />
        )}

        {isColumn && (
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              {columnType === "ENUM" && (
                <EnumTypeItem
                  isInEditMode={isInEditMode}
                  itemName={itemName}
                  editedItemName={editedItemName}
                  handleInputChange={handleInputChange}
                  columnType={columnType}
                  editedDefaultValue={editedDefaultValue}
                  enumValuesFromColumn={enumValues}
                  open={openDialog}
                  onClose={handleCloseDialog}
                  onSaveClicked={handelSelectColumnSaved} // changed from handelAddCommand
                />
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
      {columnType === "ENUM" && (
        <EditSelectDialog
          columnType={columnType}
          columnName={editedItemName}
          defaultValueFromColumn={defaultValue}
          enumValuesFromColumn={enumValues}
          open={openDialog}
          onClose={handleCloseDialog}
          onSaveClicked={handelSelectColumnSaved} // changed from handelAddCommand
        />
      )}
    </Card>
  );
};

export default EditableItem;
