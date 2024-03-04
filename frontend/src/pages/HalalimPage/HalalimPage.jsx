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
  Button,
  Typography,
  Input,
  Divider,
  Paper,
  Select,
  MenuItem,
  TextField,
  InputLabel,
} from "@mui/material";
import "./HalalimPage.css";
import Slide from "@mui/material/Slide";
import Draggable from "react-draggable";
import { validationPasswordsErrorType } from "../../utils/validators";
import { AiOutlineCloseCircle, AiOutlineDrag } from "react-icons/ai";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import { PasswordStrength } from "../../components/manageUsers/PasswordStrength";
import {
  getHalalColumnsAndTypes,
  getHalals,
  getOriginalColumns,
} from "../../utils/api/halalsApi";
import { DatePicker } from "@mui/x-date-pickers";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import dayjs from "dayjs";

function CustomToolbar({ setRows }) {
  const [openCreateNewUser, setOpenCreateNewUser] = React.useState(false);
  const [commandsSignUp, setCommandsSignUp] = React.useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";

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
        הוסף חלל חדש
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

export default function HalalimPage() {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [columnsFromDb, setColumnsFromDb] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [commands, setCommands] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [selectedFullName, setSelectedFullName] = React.useState(null);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [allDataOfHalalsColumns, setAllDataOfHalalsColumns] = React.useState(
    []
  );
  const translationDict = {
    id: "מספר זיהוי",
    privateNumber: "מספר פרטי",
    lastName: "שם משפחה",
    firstName: "שם פרטי",
    dateOfDeath: "תאריך פטירה",
    serviceType: "סוג שירות",
    circumstances: "נסיבות המוות",
    unit: "יחידה",
    division: "חטיבה",
    specialCommunity: "קהילה מיוחדת",
    area: "אזור",
    plot: "חלקה",
    line: "שורה",
    graveNumber: "מספר קבר",
    permanentRelationship: "קשר קבוע",
    comments: "הערות",
    nifgaimGraveyardId: "קבר",
    nifgaimCommandId: "פיקוד",
  };

  const handleRowClick = (params) => {
    // Store the selected row
    console.log(params);
    setSelectedRow(params.row);
    console.log(params.row);
    // Open the dialog
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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

  React.useEffect(() => {
    const fetchOringialColumns = async () => {
      try {
        const original = await getOriginalColumns();
        console.log(original);
        // setOriginalColumns(original);
      } catch (error) {
        console.error("Error during get orignialColumns:", error);
      }
    };

    fetchOringialColumns();
  }, []);

  function getColumnByName(columnName) {
    return allDataOfHalalsColumns.find(
      (column) => column.column_name === columnName
    );
  }

  React.useEffect(() => {
    // Function to fetch columns data from the API or local storage
    const fetchColumnsData = async () => {
      try {
        // Replace this with your actual method to fetch column data
        const currentColumns = await getHalalColumnsAndTypes(); // This should fetch your columns data
        console.log(currentColumns);
        setAllDataOfHalalsColumns(currentColumns);
        // Sort the columns alphabetically by column name
        currentColumns.sort((a, b) =>
          a.column_name.localeCompare(b.column_name)
        );

        const formattedColumns = currentColumns.map((column) => {
          const calculatedWidth = column.column_name.length * 10;
          const width = calculatedWidth > 120 ? calculatedWidth : 120;

          let type = column.data_type;
          // Check if the type is 'date' and format accordingly

          let renderCell1;
          if (type === "boolean") {
            renderCell1 = (params) => (
              <div style={{ textAlign: "center" }}>
                {params.value === true ? (
                  <span style={{ color: "green", fontSize: "1.2rem" }}>✓</span>
                ) : (
                  <span style={{ color: "red", fontSize: "1.2rem" }}>✗</span>
                )}
              </div>
            );
          } else if (type === "USER-DEFINED") {
            renderCell1 = (params) => (
              <div
                style={{
                  textAlign: "center",
                  borderRadius: "10px",
                  width: "100%",
                  background:
                    params.value === "מילואים"
                      ? "rgba(255, 0, 0, 0.8)" // Red with 80% opacity
                      : params.value === "קבע"
                      ? "rgba(0, 128, 0, 0.8)" // Green with 80% opacity
                      : params.value === "סדיר"
                      ? "rgba(0, 200, 255, 0.8)" // Green with 80% opacity
                      : "rgba(40, 40, 40, 0.15)", // Cyan with 80% opacity
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* can adjust the font color by the value here */}
                <p
                  style={{
                    color:
                      params.value === "מילואים"
                        ? "white"
                        : params.value === "קבע"
                        ? "white"
                        : params.value === "סדיר"
                        ? "black"
                        : "black",
                  }}
                >
                  {params.value}
                </p>
              </div>
            );
          }

          console.log(type === "USER-DEFINED");
          return {
            field: column.column_name,
            headerName: column.column_name,
            type: type,
            width: width,
            editable: false,
            headerAlign: "center",
            align: "center",
            // If it's a date, specify the date format
            ...(type === "timestamp with time zone" && {
              valueFormatter: (params) => formatDate(params.value),
            }),
            ...((type === "boolean" || type === "USER-DEFINED") && {
              renderCell: renderCell1,
            }),
          };
        });

        const halalim = await getHalals();
        console.log(halalim);
        setColumns(formattedColumns);
        setRows(halalim);
      } catch (error) {
        console.error("Error fetching column data:", error);
      }
    };

    // Function to format date as 'dd/mm/yyyy'
    const formatDate = (date) => {
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // Call the function to fetch columns data
    fetchColumnsData();
  }, []);

  return (
    <Box
      sx={{
        width: "60vw",
        height: "80vh",
        maxHeight: "70rem",
        maxWidth: "70rem",
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
        onRowClick={handleRowClick}
        rowModesModel={rowModesModel}
        localeText={heIL.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          // direction: "rtl",
          // overflow: "hidden",
          border: "none",
          // "& .MuiDataGrid-virtualScroller": {
          //   mt: "0 !important",
          //   // display: "none"
          // },

          // "& .MuiDataGrid-columnHeaders": {
          //   overflow: "unset",
          //   position: "sticky !important",
          //   left: 1,
          //   top: 0,
          // },
          // "& .MuiDataGrid-columnHeadersInner > div": {
          //   direction: "rtl !important",
          // },
          // "& .MuiDataGrid-main": {
          //   overflow: "auto",
          // },
          // "& .MuiTablePagination-actions": {
          //   direction: "ltr",
          // },
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
        open={openDialog}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        sx={{
          direction: "rtl",
          "& .MuiDialog-paper": {
            width: "100%",
          },
        }}
      >
        <DialogTitle>
          {selectedRow && selectedRow.firstName + " " + selectedRow.lastName}
        </DialogTitle>
        <Divider></Divider>

        <DialogContent>
          {selectedRow &&
            Object.entries(selectedRow).map(([key, value]) => {
              const column = getColumnByName(key);
              const isTimestamp =
                column.data_type === "timestamp with time zone";

              return (
                <div key={key} style={{ marginBottom: "10px" }}>
                  <InputLabel id={key}>
                    {translationDict[key] ? translationDict[key] : key}
                  </InputLabel>
                  {isTimestamp ? (
                    <RtlPlugin
                      style={{
                        margin: "auto",
                        width: "80%",
                        marginTop: "15px",
                      }}
                    >
                      <DatePicker
                        label="תאריך ברירת מחדל"
                        defaultValue={dayjs(value)}
                        fullWidth // onChange={handeldefaultValueChange}
                      />
                    </RtlPlugin>
                  ) : (
                    <Input defaultValue={value} fullWidth />
                  )}
                </div>
              );
            })}
        </DialogContent>

        <Divider></Divider>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
