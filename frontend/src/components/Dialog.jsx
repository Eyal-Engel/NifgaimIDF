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
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{ "& .MuiPaper-root": { width: "30vw", minWidth: "15rem" } }}
    >
      <DialogTitle sx={{ textAlign: "center" }}>
        {!isGraveyard ? "יצירת פיקוד" : "יצירת בית עלמין"}
      </DialogTitle>
      <TextField
        sx={{ width: "80%", margin: "auto", direction: "rtl"}}
        onChange={handleInputChange}
        placeholder={isGraveyard ? "שם בית העלמין" : "שם הפיקוד"}
      ></TextField>
      <Button sx={{margin: "10px", fontSize: "1.2rem"}} onClick={() => onCreateClicked(inputValue)}>יצירה</Button>
    </Dialog>
  );
}
