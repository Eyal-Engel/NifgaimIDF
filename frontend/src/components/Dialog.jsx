import React, { useState } from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { TextField } from "@mui/material";

export default function SimpleDialog(props) {
  const { onClose, open, onCreateClicked, isGraveyard } = props;
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClose = () => {
    onClose(inputValue);
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{width: "20rem"}}>
      <DialogTitle>{!isGraveyard ? "יצירת פיקוד" : "יצירת בית עלמין"}</DialogTitle>
      <TextField onChange={handleInputChange}></TextField>
      <Button onClick={() => onCreateClicked(inputValue)}>יצירה</Button>
    </Dialog>
  );
}
