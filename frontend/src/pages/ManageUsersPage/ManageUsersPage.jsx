import * as React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { heIL } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import Swal from "sweetalert2";
import {
  deleteUser,
  updateUser,
  getUsers,
  changePassword,
  getFullNameById,
  createUser,
} from "../../utils/api/usersApi";
import {
  getAllCommandsNames,
  getCommandIdByName,
  getCommandNameById,
} from "../../utils/api/commandsApi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Input,
  Divider,
  Paper,
  DialogContentText,
  Select,
  MenuItem,
} from "@mui/material";
import "./ManageUsersPage.css";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Slide from "@mui/material/Slide";
import Draggable from "react-draggable";
import {
  VALIDATOR_PASSWORD,
  validationPasswordsErrorType,
} from "../../utils/validators";
import { AiOutlineCloseCircle, AiOutlineDrag } from "react-icons/ai";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import { PasswordStrength } from "../../components/manageUsers/PasswordStrength";

function CustomToolbar({ setRows }) {
  const [openCreateNewUser, setOpenCreateNewUser] = React.useState(false);
  const [commandsSignUp, setCommandsSignUp] = React.useState([]);

  React.useEffect(() => {
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

  const [userSignUpInfo, setUserSignUpInfo] = React.useState({
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
    console.log(name, value);
    setUserSignUpInfo({
      ...userSignUpInfo,
      [name]: value,
    });
  };

  const handleCheckBoxInputChange = (e) => {
    const { name, checked } = e.target;
    const value = checked; // Set value to true if checked, false if unchecked
    console.log(name, value);
    setUserSignUpInfo({
      ...userSignUpInfo,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Perform your submission logic here, for example, sending the data to an API
    console.log("Form submitted with data:", userSignUpInfo);
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
          await createUser(user);

          const updatedUsers = await getUsers();
          const userPromises = updatedUsers.map(async (user) => ({
            id: user.id,
            privateNumber: user.privateNumber,
            fullName: user.fullName,
            command: await getCommandNameById(user.nifgaimCommandId),
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
          const errors = error.response.data.body;
          let errorsForSwal = ""; // Start unordered list

          // Split the errors string by newline character
          const errorArray = errors.split(/\r?\n/).map((errorString) => {
            // Extract error key and message
            const [key, ...messageParts] = errorString.split(": ");

            // Join message parts back together (in case the message itself contains colons)
            const message = messageParts.join(":").trim();

            // Return an object with key and message
            return { [key.trim()]: message };
          });

          console.log(errorArray);

          let errorMessages;
          if (errorArray.length > 1) {
            errorMessages = errorArray.map((error) =>
              Object.values(error)[0].replace(/,/g, "")
            );

            for (let i = 0; i < errorMessages.length; i++) {
              console.log(errorMessages[i]);
              if (
                errorMessages[i] ===
                "nifgaimUsers.nifgaimCommandId cannot be null"
              ) {
                errorsForSwal += "<li>פיקוד לא יכול להיות ריק</li>";
              }
              if (
                errorMessages[i] ===
                "Validation isNumeric on privateNumber failed"
              ) {
                errorsForSwal += "<li>מספר אישי חייב להכיל מספרים בלבד</li>";
              }
              if (
                errorMessages[i] === "Validation len on privateNumber failed"
              ) {
                errorsForSwal +=
                  "<li>מספר אישי חייב להיות באורך של 7 ספרות בדיוק</li>";
              }
              if (errorMessages[i] === "Validation is on fullName failed") {
                errorsForSwal +=
                  "<li>שם מלא צריך להיות עד 30 תווים ולהכיל אותיות בלבד</li>";
              }
            }
          } else if (
            Object.keys(errorArray[0])[0] ===
            "User exists already, please login instead."
          ) {
            errorsForSwal += "<li>מספר אישי כבר קיים במערכת</li>";
          }

          console.log(errorsForSwal);

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
          <GridToolbarExport
            color="secondary"
            sx={{
              "& .MuiButton-startIcon": {
                marginLeft: "2px",
              },
            }}
          />
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
                  type={"text"}
                  name="privateNumber"
                  placeholder="מספר אישי"
                  className="resetPasswordInputField"
                  onChange={handleInputChange}
                />
                <Input
                  type={"text"}
                  name="fullName"
                  placeholder="שם מלא"
                  className="resetPasswordInputField"
                  onChange={handleInputChange}
                />
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

                {/* <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="סיסמא"
                  className="resetPasswordInputField"
                  onChange={handleInputChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                /> */}
                {/* <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="אימות סיסמא"
                  className="resetPasswordInputField"
                  spellCheck="false"
                  onChange={handleInputChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={toggleConfirmPasswordVisibility}>
                        {showConfirmPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                /> */}
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
                    marginTop: "20px",
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
                style={{ marginTop: "20px" }}
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

const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  "& .ant-empty-img-1": {
    fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
  },
  "& .ant-empty-img-2": {
    fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
  },
  "& .ant-empty-img-3": {
    fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
  },
  "& .ant-empty-img-4": {
    fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
  },
  "& .ant-empty-img-5": {
    fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
    fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        {/* SVG paths */}
      </svg>
      <Box sx={{ mt: 1 }}>No Rows</Box>
    </StyledGridOverlay>
  );
}

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} sx={{ borderRadius: "10px" }} />
    </Draggable>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ManageExistsUsers() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [commands, setCommands] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [selectedFullName, setSelectedFullName] = React.useState(null);
  const [userLoginInfo, setPasswordInfo] = React.useState({
    password: "",
    confirmPassword: "",
  });

  const handleChangePasswordRegister = (value) => {
    setPasswordInfo({
      ...userLoginInfo,
      password: value,
    });
  };

  const handleChangeConfirmRegister = (value) => {
    setPasswordInfo({
      ...userLoginInfo,
      confirmPassword: value,
    });
  };

  React.useEffect(() => {
    const fetchDataUsers = async () => {
      setLoading(true);
      try {
        const usersData = await getUsers();
        const userPromises = usersData.map(async (user) => ({
          id: user.id,
          privateNumber: user.privateNumber,
          fullName: user.fullName,
          command: await getCommandNameById(user.nifgaimCommandId),
        }));
        const transformedUsers = await Promise.all(userPromises);
        setRows(transformedUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching or transforming users:", error);
        setLoading(false);
      }
    };

    fetchDataUsers();
  }, []);

  React.useEffect(() => {
    const fetchCommandsData = async () => {
      try {
        const commandsNames = await getAllCommandsNames();
        setCommands(commandsNames);
      } catch (error) {
        console.error("Error during get commands:", error);
      }
    };

    fetchCommandsData();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleResetPassword = (id) => async () => {
    setSelectedUserId(id);
    const selectedUserName = await getFullNameById(id);
    setSelectedFullName(selectedUserName);
    setOpen(true);
  };

  const handleDeleteClick = (id) => () => {
    try {
      // const loggedUserId = JSON.parse(localStorage.getItem("userData")).userId;

      const loggedUserId = -1;
      if (id !== loggedUserId) {
        const userFullName = rows.find((row) => row.id === id).fullName;

        Swal.fire({
          title: `האם את/ה בטוח/ה שתרצה/י למחוק את המשתמש ${userFullName}`,
          text: "פעולה זאת איננה ניתנת לשחזור",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "מחק משתמש",
          cancelButtonText: "בטל",
          reverseButtons: true,
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await deleteUser(id);
              setRows(rows.filter((row) => row.id !== id));
              Swal.fire({
                title: `משתמש "${userFullName}" נמחק בהצלחה!`,
                text: "",
                icon: "success",
                confirmButtonText: "אישור",
              }).then((result) => {});
            } catch (error) {
              Swal.fire({
                title: `לא ניתן למחוק את המשתמש`,
                text: error,
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "אישור",
                reverseButtons: true,
              }).then((result) => {});
            }
          }
        });
      } else {
        Swal.fire({
          title: `לא ניתן למחוק את המשתמש`,
          text: "משתמש אינו יכול למחוק את עצמו",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "אישור",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleUpdatePassword = async () => {
    const newPassword = userLoginInfo.password;
    const confirmPassword = userLoginInfo.confirmPassword;

    const error = validationPasswordsErrorType(
      newPassword,
      confirmPassword
    ).msg;

    let errorMsgForSwal = "";

    if (error === "Identical and valid") {
      errorMsgForSwal = "זהות ותקינות";
    } else if (error === "Identical but invalid") {
      errorMsgForSwal = "הסיסמאות שהזנת זהות, אך אינן תקינות";
    } else if (error === "Not identical, confirm password validation failed") {
      errorMsgForSwal = "הסיסמאות שהזנת אינן זהות, אימות סיסמא אינה תקינה";
    } else if (error === "Identical, password validation failed") {
      errorMsgForSwal = "הסיסמאות שהזנת זהות, סיסמא אינה תקינה";
    } else if (error === "Not identical, both invalid") {
      errorMsgForSwal =
        "הסיסמאות שהזנת אינן זהות, סיסמא ואימות סיסמא אינן תקינות";
    } else if (error === "Not identical, both invalid") {
      errorMsgForSwal =
        "הסיסמאות שהזנת אינן זהות, סיסמא ואימות סיסמא אינן תקינות";
    } else if (error === "Not identical, both valid") {
      errorMsgForSwal = "הסיסמאות שהזנת אינן זהות";
    }

    if (errorMsgForSwal !== "זהות ותקינות") {
      Swal.fire({
        title: `שגיאה בעדכון סיסמא`,
        text: errorMsgForSwal,
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "אישור",
        reverseButtons: true,
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    } else {
      try {
        await changePassword(selectedUserId, newPassword);
        const fullName = await getFullNameById(selectedUserId);
        Swal.fire({
          title: `סיסמא עודכנה בהצלחה`,
          text: `הסיסמא החדשה של המשתמש ${fullName} הינה ${newPassword}`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "אישור",
          reverseButtons: true,
          customClass: {
            container: "swal-dialog-custom",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            setOpen(false);
          }
        });
      } catch (error) {
        console.log("Error processing row update:", error);
        Swal.fire({
          title: `שגיאה בעדכון סיסמא`,
          text: "לא ניתן לעדכן סיסמא חדשה, נסה שוב מאוחר יותר",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "אישור",
          reverseButtons: true,
          customClass: {
            container: "swal-dialog-custom",
          },
        });
      }
    }
  };

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };

    const { id, privateNumber, fullName, command } = updatedRow;

    try {
      const nifgaimCommandId = await getCommandIdByName(command);
      const filteredUser = {
        privateNumber,
        fullName,
        nifgaimCommandId,
      };
      console.log(filteredUser);

      await updateUser(id, filteredUser);

      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

      return updatedRow;
    } catch (error) {
      console.log("Error processing row update:", error);
      Swal.fire({
        title: `אחד מהנתונים שהזנת אינו תקין, נסה שנית`,
        text: "",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "אישור",
        reverseButtons: true,
      }).then((result) => {});
      throw error;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "privateNumber",
      headerName: "מספר אישי",
      headerAlign: "center",
      align: "center",
      type: "string",
      editable: true,
      flex: 1,
    },

    {
      field: "fullName",
      headerName: "שם מלא",
      headerAlign: "center",
      type: "string",
      editable: true,
      flex: 1,
      align: "center",
    },

    {
      field: "command",
      headerName: "פיקוד",
      headerAlign: "center",
      tfontColor: "white",
      type: "singleSelect",
      editable: true,
      flex: 1,
      valueOptions: commands,
      valueFormatter: ({ value }) => {
        const option = commands.find(
          ({ value: optionValue }) => optionValue === value
        );
        return option ? option.label : value; // Return the label if found, otherwise return the original value
      },
      cellClassName: (params) => {
        const option = commands.find(
          ({ value: optionValue }) => optionValue === params.value
        );
      },
    },

    {
      field: "actions",
      type: "actions",
      headerName: "פעולות",
      headerAlign: "center",
      flex: 1,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              color="primary"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="error"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="primary"
          />,
          <GridActionsCellItem
            icon={<LockIcon />}
            label="ResetPassword"
            onClick={handleResetPassword(id)}
            color="gray"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="error"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        width: "35vw",
        height: "70vh",
        maxHeight: "40rem",
        maxWidth: "40rem",
        "@media screen and (max-width: 1200px)": {
          width: "50vw",
          height: "70vh",
          maxHeight: "40rem",
          maxWidth: "60rem",
        },
        direction: "ltr",
        background: "white",
        // alignItems: "center",
        // justifyContent: "center",
        borderRadius: "2rem",
        boxShadow: "5px 5px 31px 5px rgba(0, 0, 0, 0.75)",
      }}
    >
      <DataGrid
        rows={rows}
        loading={loading}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        localeText={heIL.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          direction: "rtl",
          border: "none",
          "& .MuiDataGrid-virtualScroller": {
            mt: "0 !important",
          },

          "& .MuiDataGrid-columnHeaders": {
            overflow: "unset",
            position: "sticky !important",
            left: 1,
            top: 0,
          },
          "& .MuiDataGrid-columnHeadersInner > div": {
            direction: "rtl !important",
          },
          "& .MuiDataGrid-main": {
            overflow: "auto",
          },
          "& .MuiTablePagination-actions": {
            direction: "ltr",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#EDF3F8",
          },
          "& .MuiButton-textSizeSmall": {},
          "& .MuiDataGrid-columnHeadersInner": {
            bgcolor: "#fccd38",
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            color: "white",
          },
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        slots={{
          toolbar: CustomToolbar,
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
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
          <Typography fontWeight="bold">
            למשתמש: "{selectedFullName}"
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ direction: "rtl" }}>
          {/* <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="סיסמא"
            className="resetPasswordInputField"
            onChange={handlePasswordInputChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            }
          /> */}
          {/* <Input
            type={showConfirmPassword ? "text" : "password"}
            name="password"
            placeholder="אימות סיסמא"
            className="resetPasswordInputField"
            onChange={handleConfirmPasswordInputChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </IconButton>
              </InputAdornment>
            }
          /> */}

          <PasswordStrength
            id="confirmPasswordReset"
            placeholder="אימות סיסמא"
            onChangePassword={handleChangePasswordRegister}
            onChangeConfirmPassword={handleChangeConfirmRegister}
          />
        </DialogContent>
        <Divider></Divider>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            ביטול
          </Button>
          <Button onClick={handleUpdatePassword} color="primary">
            עדכון סיסמא
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
