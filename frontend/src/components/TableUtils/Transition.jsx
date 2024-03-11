import * as React from "react";
import "../../pages/ManageUsersPage/ManageUsersPage.css";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default Transition;