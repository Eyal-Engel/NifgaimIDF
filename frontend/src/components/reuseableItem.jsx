import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

const EditableItem = ({
  itemName,
  itemId,
  handleItemNameChange,
  handleDeleteItem,
  isGraveyard
}) => {
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [editedItemName, setEditedItemName] = useState(itemName);

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
      }}
    >
      <CardContent sx={{ display: "flex" }}>
        {!isInEditMode ? (
          <Typography
            sx={{ textAlign: isGraveyard ? "end" : "start" }}
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
              fontSize: "20px",
              padding: "8px",
              margin: "2px",
              direction: "rtl",
            }}
          />
        )}
      </CardContent>
      <CardActions className={isGraveyard ? "actionGraveyardItemButton" : "actionCommandItemButtons"}>
        {!isInEditMode ? (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            מחק
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={handleCancelClick}
          >
            בטל
          </Button>
        )}
        {!isInEditMode ? (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditClick}
          >
            עריכה
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="success"
            startIcon={<SaveIcon />}
            onClick={handleSaveClick}
          >
            שמור
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default EditableItem;
