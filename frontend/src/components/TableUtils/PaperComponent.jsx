import { Paper } from "@mui/material";
import React from "react";
import Draggable from "react-draggable";

export default function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} sx={{ borderRadius: "10px" }} />
    </Draggable>
  );
}
