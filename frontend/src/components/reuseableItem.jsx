import React, { useState } from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { Input, Typography, useMediaQuery } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import { IconButton, ThemeProvider, createTheme } from "@mui/material";
import "./ReuseableItem.css";
import IntegerTypeItem from "./manageColumns/IntegerTypeItem";
import StringTypeItem from "./manageColumns/StringTypeItem";
import BooleanTypeItem from "./manageColumns/BooleanTypeItem";
import DateTypeItem from "./manageColumns/DateTypeItem";
import EnumTypeItem from "./manageColumns/EnumTypeItem";
import UuidTypeItem from "./manageColumns/UuidTypeItem";

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

const ReuseableItem = ({
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
  const [isInEditMode, setIsInEditMode] = useState(isNewItem ? true : false);
  const [error, setError] = useState();
  const [editedItemName, setEditedItemName] = useState(itemName);
  const [editedDefaultValue, setEditedDefaultValue] = useState(
    defaultValue || ""
  );

  const formatDateToString = (dayjsObject) => {
    if (!dayjsObject || !dayjsObject.isValid()) {
      return "Invalid dayjs object";
    }

    // Format the date as DD/MM/YYYY
    const formattedDate = dayjsObject.format("DD/MM/YYYY");

    return formattedDate;
  };

  const handleEditClick = () => {
    // if (columnType === "ENUM") {
    //   setOpenDialog(true);
    // } else {
    setIsInEditMode(true);
    // }
  };

  const handleSaveClick = () => {
    if (editedItemName !== "") {
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
      setIsInEditMode(false);
      setError(null);
    } else {
      setError({ type: "required", message: "חובה להכניס שם" });
    }
  };

  // const handelSelectColumnSaved = (
  //   newColumnName,
  //   columnType,
  //   defaultValue,
  //   enumValues
  // ) => {
  //   console.log(newColumnName, columnType, defaultValue, enumValues);

  //   handleItemNameChange(
  //     itemId,
  //     newColumnName,
  //     columnType,
  //     defaultValue,
  //     enumValues
  //   );
  //   setOpenDialog(false);
  // };

  const handleDeleteClick = () => {
    handleDeleteItem(itemId, itemName);
  };

  const handleCancelClick = () => {
    setEditedItemName(itemName);
    setEditedDefaultValue(defaultValue || "");
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
              inputProps={{ maxLength: "500" }}
            />
            {error && <p style={{ color: "red" }}>{error.message}</p>}
          </div>
        )}
        {columnType === "UUID" && (
          <UuidTypeItem
            isInEditMode={isInEditMode}
            itemName={itemName}
            editedItemName={editedItemName}
            handleInputChange={handleInputChange}
            columnType={columnType}
          />
        )}
        {columnType === "INTEGER" && (
          <IntegerTypeItem
            isInEditMode={isInEditMode}
            defaultValue={defaultValue}
            editedDefaultValue={editedDefaultValue}
            handleInputDefaultValueChange={handleInputDefaultValueChange}
          />
        )}
        {columnType === "STRING" && (
          <StringTypeItem
            isInEditMode={isInEditMode}
            defaultValue={defaultValue}
            editedDefaultValue={editedDefaultValue}
            handleInputDefaultValueChange={handleInputDefaultValueChange}
          />
        )}
        {columnType === "BOOLEAN" && (
          <BooleanTypeItem
            isInEditMode={isInEditMode}
            editedDefaultValue={editedDefaultValue}
            handleInputDefaultValueChange={handleInputDefaultValueChange}
          />
        )}
        {columnType === "DATE" && (
          <DateTypeItem
            isInEditMode={isInEditMode}
            editedDefaultValue={editedDefaultValue}
            handleInputDefaultValueChange={handleInputDefaultValueChange}
          />
        )}

        {isColumn && (
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              {columnType === "ENUM" && (
                <EnumTypeItem
                  columnType={columnType}
                  editedDefaultValue={editedDefaultValue}
                  enumValuesFromColumn={enumValues}
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
            <IconButton onClick={handleDeleteClick}>
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
              <LockIcon color="secondary" />
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<LockIcon />}
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

export default React.memo(ReuseableItem);
