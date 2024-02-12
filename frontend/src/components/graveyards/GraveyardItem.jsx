import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";

export default function GraveyardItem({graveyardName}) {
  const [isInEditMode, setIsInEditMode] = useState(false);

  const handleEditClick = () => {
    setIsInEditMode(true);
  };

  const handleSaveClick = () => {
    setIsInEditMode(false);
  };
  return (
    <Card
      sx={{
        display: "flex",
        width: "600px",
        margin: "20px",
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "10px",
        boxShadow: "2px 2px 2px 1px rgb(0 0 0 / 20%)",
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div">
          {graveyardName}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
          מחק
        </Button>
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
}
