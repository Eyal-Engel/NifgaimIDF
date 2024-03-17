import * as React from "react";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import Swal from "sweetalert2";
import { getUsers, createUser } from "../../utils/api/usersApi";
import {
  getAllCommandsNames,
  getCommandIdByName,
  getCommandNameById,
} from "../../utils/api/commandsApi";
import {
  Dialog,
  Button,
  Input,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { AiOutlineCloseCircle, AiOutlineDrag } from "react-icons/ai";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import { PasswordStrength } from "../../components/manageUsers/PasswordStrength";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import "../../pages/ManageUsersPage/ManageUsersPage.css";
import Transition from "./Transition";
import PaperComponent from "./PaperComponent";
import { useLayoutEffect } from "react";
import { useState } from "react";
export default function CustomToolbar({ setRows, rows, columns }) {
  const [openCreateNewUser, setOpenCreateNewUser] = useState(false);
  const [commandsSignUp, setCommandsSignUp] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";

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

  useLayoutEffect(() => {
    const fetchCommandsData = async () => {
      try {
        const commandsNames = await getAllCommandsNames();
        setCommandsSignUp(commandsNames);
      } catch (error) {
        console.error("Error during get commands:", error);
      }
    };

    fetchCommandsData();
  }, []);

  const handleCreateNewUser = () => {
    setOpenCreateNewUser(true);
  };

  const handleClose = () => {
    setOpenCreateNewUser(false); // Close the dialog
  };

  const [userSignUpInfo, setUserSignUpInfo] = useState({
    privateNumber: "",
    fullName: "",
    password: "",
    command: "",
    confirmPassword: "",
    editPerm: false,
    managePerm: false,
  });

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
  const handleSubmit = async () => {
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
        const commandId = await getCommandIdByName(userSignUpInfo.command);

        const user = {
          privateNumber: userSignUpInfo.privateNumber,
          fullName: userSignUpInfo.fullName,
          password: userSignUpInfo.password,
          commandId: commandId,
          editPerm: userSignUpInfo.editPerm,
          managePerm: userSignUpInfo.managePerm,
        };

        try {
          await createUser(loggedUserId, user);

          const updatedUsers = await getUsers();
          const userPromises = updatedUsers.map(async (user) => ({
            id: user.id,
            privateNumber: user.privateNumber,
            fullName: user.fullName,
            command: await getCommandNameById(user.nifgaimCommandId),
            editPerm: user.editPerm,
            managePerm: user.managePerm,
          }));
          const transformedUsers = await Promise.all(userPromises);
          setRows(transformedUsers);

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
            if (
              error.message === "nifgaimUsers.nifgaimCommandId cannot be null"
            ) {
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
          {/* <GridToolbarExport
              color="secondary"
              sx={{
                "& .MuiButton-startIcon": {
                  marginLeft: "2px",
                },
              }}
            /> */}
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
        <div
          className="boxAccountContainer"
          style={{
            height: "800px", // Set your desired height here
            borderRadius: "inherit",
          }}
        >
          <div
            style={{
              zIndex: "9999",
              display: "flex",
              padding: "10px",
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

          <div className="topAccountContainer">
            <motion.div className="backdrop" style={{ marginTop: "-60px" }} />
            <div className="header-text">יצירת משתמש חדש</div>
          </div>
          <div className="innerAccountContainer">
            <div className="boxLoginContainer" style={{ marginTop: "-50px" }}>
              <form
                className="formLoginContainer"
                style={{ marginTop: "-60px" }}
              >
                <Input
                  type="text"
                  name="privateNumber"
                  placeholder="מספר אישי"
                  className="resetPasswordInputField"
                  onChange={handleInputChange}
                />
                <Input
                  type="text"
                  name="fullName"
                  placeholder="שם מלא"
                  className="resetPasswordInputField"
                  onChange={handleInputChange}
                  style={{ marginBottom: 0 }}
                />
                <FormHelperText
                  style={{ textAlign: "right", marginBottom: "5px" }}
                >
                  שם מלא יהיה בעברית בלבד
                </FormHelperText>
                <Select
                  sx={{ direction: "rtl" }}
                  labelId="fullName-label"
                  id="fullName"
                  name="command"
                  defaultValue=""
                  onChange={handleInputChange}
                  displayEmpty
                  className="resetPasswordInputField"
                  renderValue={(value) => (value ? value : "פיקוד")} // Render placeholder
                >
                  <MenuItem sx={{ direction: "rtl" }} value="" disabled>
                    פיקוד
                  </MenuItem>
                  {commandsSignUp.map((command) => (
                    <MenuItem
                      sx={{ direction: "rtl" }}
                      key={command}
                      value={command}
                    >
                      {command}
                    </MenuItem>
                  ))}
                </Select>
                <PasswordStrength
                  id="confirmPasswordRegister"
                  placeholder="אימות סיסמא"
                  onChangePassword={handleChangePassword}
                  onChangeConfirmPassword={handleChangeConfirmPassword}
                />
                <h2
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  הרשאות משתמש
                </h2>
                <div
                  className="perms"
                  style={{
                    display: "flex",
                    flexDirection: "row", // Change flexDirection to column
                    justifyContent: "space-around", // Center vertically
                    alignItems: "center", // Center horizontally
                  }}
                >
                  <div>
                    <label style={{ fontSize: "1.5em" }}>עריכת הרשאות</label>{" "}
                    {/* Increase font size */}
                    <input
                      type="checkbox"
                      name="editPerm"
                      onChange={handleCheckBoxInputChange}
                      style={{ transform: "scale(1.5)" }} // Increase checkbox size
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "1.5em" }}>מנהל הרשאות</label>{" "}
                    {/* Increase font size */}
                    <input
                      type="checkbox"
                      name="managePerm"
                      onChange={handleCheckBoxInputChange}
                      style={{ transform: "scale(1.5)" }} // Increase checkbox size
                    />
                  </div>
                </div>
              </form>
              <button
                type="submit"
                className="submit-button"
                onClick={handleSubmit}
                style={{ marginTop: "10px" }}
              >
                צור משתמש
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
