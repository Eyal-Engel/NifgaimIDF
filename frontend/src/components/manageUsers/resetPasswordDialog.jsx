import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { AiOutlineDrag } from "react-icons/ai";
import { PasswordStrength } from "../../components/manageUsers/PasswordStrength";
import Transition from "../../components/TableUtils/Transition";
import PaperComponent from "../../components/TableUtils/PaperComponent";
import { useForm } from "react-hook-form";
export default function ResetPasswordDialog({
  open,
  setOpen,
  selectedFullName,
  userLoginInfo,
  handleChangePasswordRegister,
  handleChangeConfirmRegister,
  handleUpdatePassword,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <Dialog
      sx={{ direction: "rtl", backgroundColor: "none" }}
      open={open}
      TransitionComponent={Transition}
      PaperComponent={PaperComponent}
      onClose={() => setOpen(false)}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          איפוס סיסמא
          <AiOutlineDrag
            style={{ cursor: "move", fontSize: "24px" }}
            id="draggable-dialog-title"
          />
        </div>
        <Typography fontWeight="bold">למשתמש: "{selectedFullName}"</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(handleUpdatePassword)}>
        <DialogContent
          sx={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            direction: "rtl",
          }}
        >
          <PasswordStrength
            id="confirmPasswordReset"
            placeholder="אימות סיסמא"
            register={register}
            errors={errors}
            userLoginInfo={userLoginInfo}
            onChangePassword={handleChangePasswordRegister}
            onChangeConfirmPassword={handleChangeConfirmRegister}
          />
        </DialogContent>
        <Divider></Divider>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            ביטול
          </Button>
          <Button type="submit" color="primary">
            עדכון סיסמא
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
