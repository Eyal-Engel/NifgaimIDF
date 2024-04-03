import * as React from "react";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import Swal from "sweetalert2";
import { createUser } from "../../utils/api/usersApi";
import {
  Dialog,
  Button,
  Input,
  Select,
  MenuItem,
  FormLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
} from "@mui/material";
import { AiOutlineCloseCircle, AiOutlineDrag } from "react-icons/ai";
import AddIcon from "@mui/icons-material/Add";
import { PasswordStrength } from "../../components/manageUsers/PasswordStrength";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import "../../pages/ManageUsersPage/ManageUsersPage.css";
import Transition from "./Transition";
import PaperComponent from "./PaperComponent";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  getCommandIdByName,
  getCommandNameById,
} from "../../utils/api/commandsApi";
export default function CustomToolBarManageUsers({
  setRows,
  rows,
  columns,
  commands,
}) {
  const [openCreateNewUser, setOpenCreateNewUser] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";
  const [userSignUpInfo, setUserSignUpInfo] = useState({
    privateNumber: "",
    fullName: "",
    password: "",
    command: "",
    confirmPassword: "",
    editPerm: false,
    managePerm: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleExportToExcel = () => {
    // Filter out the "פעולות" column
    const filteredColumns = columns.filter(
      (col) => col.headerName !== "פעולות"
    );

    // Map data based on the filtered columns
    const data = rows.map((row) =>
      filteredColumns.map((col) => {
        const value = row[col.field];
        // Convert boolean values to Hebrew strings
        if (typeof value === "boolean") {
          return value ? "כן" : "לא";
        }
        return value;
      })
    );

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet([
      filteredColumns.map((col) => col.headerName),
      ...data,
    ]);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Convert workbook to binary data and save it
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "נפגעים - משתמשים.xlsx"
    );
  };

  const handleCreateNewUser = () => {
    setOpenCreateNewUser(true);
  };

  const handleClose = () => {
    console.log("object");
    setUserSignUpInfo({
      privateNumber: "",
      fullName: "",
      password: "",
      command: "",
      confirmPassword: "",
      editPerm: false,
      managePerm: false,
    });
    setOpenCreateNewUser(false); // Close the dialog
  };

  const handleChangePassword = (value) => {
    // setPassword(value);

    setUserSignUpInfo({
      ...userSignUpInfo,
      password: value,
    });
  };

  const handleChangeConfirmPassword = (value) => {
    // setConfirmPassword(value);

    setUserSignUpInfo({
      ...userSignUpInfo,
      confirmPassword: value,
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserSignUpInfo({
      ...userSignUpInfo,
      [name]: value,
    });
  };

  const handleCheckBoxInputChange = (e) => {
    const { name, checked } = e.target;
    const value = checked; // Set value to true if checked, false if unchecked
    setUserSignUpInfo({
      ...userSignUpInfo,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmitForm = async () => {
    // Perform your submission logic here, for example, sending the data to an API
    let errorsForSwalFrontendTesting = ""; // Start unordered list

    if (userSignUpInfo.password !== userSignUpInfo.confirmPassword) {
      errorsForSwalFrontendTesting += "<li>סיסמא ואימות סיסמא אינם זהים</li>";
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(userSignUpInfo.password)) {
      errorsForSwalFrontendTesting +=
        "<li>סיסמא אינה תקינה - סיסמא תקינה צריכה להיות באורך של לפחות 6 תווים ומכיל לפחות אות אחת וספרה אחת.</li>";
    }

    if (errorsForSwalFrontendTesting === "") {
      try {
        console.log(userSignUpInfo);
        const user = {
          privateNumber: userSignUpInfo.privateNumber,
          fullName: userSignUpInfo.fullName,
          password: userSignUpInfo.password,
          commandId: await getCommandIdByName(userSignUpInfo.command),
          editPerm: userSignUpInfo.editPerm,
          managePerm: userSignUpInfo.managePerm,
        };

        console.log(user);

        try {
          const newUser = await createUser(loggedUserId, user);

          console.log(newUser);
          const commandName = await getCommandNameById(
            newUser.nifgaimCommandId
          );

          const newUserData = {
            ...newUser,
            commandName: commandName,
          };

          console.log(newUserData);

          setRows([...rows, newUserData]);

          Swal.fire({
            title: `משתמש "${userSignUpInfo.fullName}" נוצר בהצלחה!`,
            text: "",
            icon: "success",
            confirmButtonText: "אישור",
            customClass: {
              container: "swal-dialog-custom",
            },
          }).then((result) => {
            if (result.isConfirmed) {
              handleClose();
            }
          });
        } catch (error) {
          console.log(error);
          const errors = error.response.data.body.errors;
          let errorsForSwal = ""; // Start unordered list

          errors.forEach((error) => {
            if (error.message === "commandName cannot be null") {
              errorsForSwal += "<li>פיקוד לא יכול להיות ריק</li>";
            }
            if (
              error.message === "Validation isNumeric on privateNumber failed"
            ) {
              errorsForSwal += "<li>מספר אישי חייב להכיל מספרים בלבד</li>";
            }
            if (error.message === "Validation len on privateNumber failed") {
              errorsForSwal +=
                "<li>מספר אישי חייב להיות באורך של 7 ספרות בדיוק</li>";
            }
            if (error.message === "Validation is on fullName failed") {
              errorsForSwal +=
                "<li>שם מלא צריך להיות עד 30 תווים ולהכיל אותיות בלבד</li>";
            }
            if (error.message === "privateNumber must be unique") {
              errorsForSwal += "<li>מספר אישי כבר קיים במערכת</li>";
            }
          });

          Swal.fire({
            title: ` לא ניתן ליצור את המשתמש ${userSignUpInfo.fullName}`,
            html: `<ul style="direction: rtl; text-align: right">${errorsForSwal}</ul>`, // Render errors as list items
            icon: "error",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "אישור",
            reverseButtons: true,
            customClass: {
              container: "swal-dialog-custom",
            },
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      Swal.fire({
        title: ` לא ניתן ליצור את המשתמש ${userSignUpInfo.fullName}`,
        html: `<ul style="direction: rtl; text-align: right">${errorsForSwalFrontendTesting}</ul>`, // Render errors as list items
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "אישור",
        reverseButtons: true,
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  return (
    <>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleCreateNewUser}
        sx={{
          paddingRight: "60px",
          borderRadius: "5000px 5000px 0 0",

          "& .MuiButton-startIcon": {
            marginLeft: "-125px",
          },
          "&:hover": {
            backgroundColor: "#EDF3F8",
          },
        }}
      >
        צור משתמש חדש
      </Button>
      <GridToolbarContainer
        style={{
          direction: "rtl",
          marginTop: "0.5vh",
          marginRight: "0.5vw",
          justifyContent: "space-between",
        }}
      >
        <div>
          <GridToolbarColumnsButton
            color="secondary"
            sx={{
              "& .MuiButton-startIcon": {
                marginLeft: "2px",
              },
            }}
          />
          <GridToolbarFilterButton
            color="secondary"
            sx={{
              "& .MuiButton-startIcon": {
                marginLeft: "2px",
              },
            }}
          />
          <GridToolbarDensitySelector
            color="secondary"
            sx={{
              "& .MuiButton-startIcon": {
                marginLeft: "2px",
              },
            }}
          />
          <Button
            color="secondary"
            startIcon={<SaveAltIcon />}
            onClick={handleExportToExcel}
            sx={{
              fontSize: "small",
              "& .MuiButton-startIcon": {
                marginLeft: "2px",
              },
              "&:hover": {
                backgroundColor: "#EDF3F8",
              },
            }}
          >
            ייצוא לאקסל
          </Button>
        </div>
        <div>
          <GridToolbarQuickFilter
            placeholder="חיפוש"
            style={{
              marginRight: "1rem",
            }}
            sx={{
              "& .MuiInputBase-root": {
                width: "87%",
                height: "28px",
                direction: "rtl",
              },
              "& .MuiSvgIcon-root": {
                display: "none",
              },
            }}
          />
        </div>
      </GridToolbarContainer>
      <Dialog
        sx={{
          direction: "rtl",
        }}
        open={openCreateNewUser}
        TransitionComponent={Transition}
        PaperComponent={PaperComponent}
        onClose={() => handleClose()}
        aria-labelledby="draggable-dialog-title"
      >
        <div className="signUpWrapper">
          <div
            style={{
              zIndex: "9999",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <AiOutlineCloseCircle
              style={{
                cursor: "pointer",
                fontSize: "30px",
              }}
              onClick={() => handleClose()}
            />
            <AiOutlineDrag
              style={{
                cursor: "move",
                fontSize: "24px",
              }}
              id="draggable-dialog-title"
            />
          </div>

          <FormLabel
            sx={{
              color: "#ffa726",
              alignSelf: "center",
              fontSize: "1.8rem",
              marginBottom: "10px",
            }}
          >
            יצירת משתמש חדש
          </FormLabel>
          <Divider></Divider>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              padding: "20px",
            }}
          >
            <FormControl>
              <Input
                type="text"
                name="privateNumber"
                placeholder="מספר אישי"
                value={userSignUpInfo.privateNumber || ""}
                {...register("privateNumber", {
                  required: {
                    value: true,
                    message: "מספר אישי שדה חובה",
                  },
                  pattern: {
                    value: /^\d{7}$/,
                    message: ` הכנס מספר אישי בעל 7 ספרות `,
                  },
                })}
                onChange={handleInputChange}
                inputProps={{ maxLength: "7" }}
              />
              {errors["privateNumber"] && (
                <p style={{ color: "red" }}>
                  {errors["privateNumber"].message}
                </p>
              )}
            </FormControl>
            <FormControl>
              <Input
                type="text"
                name="fullName"
                placeholder="שם מלא"
                value={userSignUpInfo.fullName || ""}
                {...register("fullName", {
                  required: {
                    value: true,
                    message: "שם מלא שדה חובה",
                  },
                })}
                onChange={handleInputChange}
                inputProps={{ maxLength: "500" }}
              />
              {errors["fullName"] && (
                <p style={{ color: "red" }}>{errors["fullName"].message}</p>
              )}
            </FormControl>

            <FormControl>
              <Select
                sx={{ direction: "rtl" }}
                size="small"
                name="command"
                defaultValue=""
                value={userSignUpInfo.command || ""}
                {...register("command", {
                  validate: (value) => {
                    if (value === "") {
                      return "חובה לבחור פיקוד";
                    } else {
                      return true;
                    }
                  },
                })}
                onChange={handleInputChange}
                displayEmpty
                renderValue={(value) => (value ? value : "פיקוד")} // Render placeholder
              >
                <MenuItem sx={{ direction: "rtl" }} value="" disabled>
                  פיקוד
                </MenuItem>
                {commands.map((command) => (
                  <MenuItem
                    sx={{ direction: "rtl" }}
                    key={command}
                    value={command}
                  >
                    {command}
                  </MenuItem>
                ))}
              </Select>
              {errors["command"] && (
                <p style={{ color: "red" }}>{errors["command"].message}</p>
              )}
            </FormControl>

            <PasswordStrength
              id="confirmPasswordRegister"
              placeholder="אימות סיסמא"
              register={register}
              errors={errors}
              userSignUpInfo={userSignUpInfo}
              onChangePassword={handleChangePassword}
              onChangeConfirmPassword={handleChangeConfirmPassword}
            />
            <FormControl>
              <FormLabel
                sx={{
                  alignSelf: "center",
                  fontSize: "1.3rem",
                  marginBottom: "5px",
                }}
              >
                הרשאות משתמש
              </FormLabel>
              {/* <FormControlLabel>הרשאות משתמש</FormControlLabel> */}
              <FormGroup
                row
                sx={{ display: "flex", justifyContent: "space-evenly" }}
              >
                <FormControlLabel
                  sx={{ margin: "0px" }}
                  control={
                    <Checkbox
                      checked={userSignUpInfo.editPerm || false}
                      onChange={handleCheckBoxInputChange}
                      name="editPerm"
                    />
                  }
                  label="הרשאות עריכה"
                />

                <FormControlLabel
                  sx={{ margin: "0px" }}
                  control={
                    <Checkbox
                      checked={userSignUpInfo.managePerm || false}
                      onChange={handleCheckBoxInputChange}
                      name="managePerm"
                    />
                  }
                  label="הרשאות מנהל"
                />
              </FormGroup>
            </FormControl>
          </form>
          <Divider></Divider>

          <Button
            type="submit"
            onClick={handleSubmit(handleSubmitForm)}
            // style={{ marginTop: "10px" }}
          >
            צור משתמש
          </Button>
        </div>
      </Dialog>
    </>
  );
}
