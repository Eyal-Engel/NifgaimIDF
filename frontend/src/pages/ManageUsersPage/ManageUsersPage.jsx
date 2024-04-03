import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { heIL } from "@mui/x-data-grid";
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
} from "../../utils/api/usersApi";
import { getAllCommandsNames } from "../../utils/api/commandsApi";
import "./ManageUsersPage.css";
import { validationPasswordsErrorType } from "../../utils/validators";
import CustomToolBarManageUsers from "../../components/TableUtils/CustomToolBarManageUsers";
import CustomNoRowsOverlay from "../../components/TableUtils/CustomNoRowsOverlay";
import { useState } from "react";
import { useEffect } from "react";
import ResetPasswordDialog from "../../components/manageUsers/resetPasswordDialog";
import { getCommandNameById } from "../../utils/api/commandsApi";
import { getCommandIdByName } from "../../utils/api/commandsApi";

export default function ManageExistsUsers() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [commands, setCommands] = useState([]);

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedFullName, setSelectedFullName] = useState(null);
  const [userLoginInfo, setPasswordInfo] = useState({
    password: "",
    confirmPassword: "",
  });
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";

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

  useEffect(() => {
    const fetchDataUsers = async () => {
      setLoading(true);
      try {
        const usersData = await getUsers();
        const userPromises = usersData.map(async (user) => ({
          id: user.id,
          privateNumber: user.privateNumber,
          fullName: user.fullName,
          commandName: await getCommandNameById(user.nifgaimCommandId),
          editPerm: user.editPerm,
          managePerm: user.managePerm,
        }));
        const transformedUsers = await Promise.all(userPromises);
        console.log(usersData);
        console.log(transformedUsers);
        setRows(transformedUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching or transforming users:", error);
      }
    };

    fetchDataUsers();
  }, []);

  useEffect(() => {
    const sortedRows = [...rows].sort(
      (a, b) => a.privateNumber - b.privateNumber
    );
    setRows(sortedRows);
  }, [rows]);

  useEffect(() => {
    const fetchCommandsData = async () => {
      try {
        const commandsNames = await getAllCommandsNames();
        setCommands(commandsNames);
      } catch (error) {
        console.error("Error during get commands:", error);
      }
    };

    fetchCommandsData();
  }, [loggedUserId]);

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
          customClass: {
            container: "swal-dialog-custom",
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await deleteUser(loggedUserId, id);
              setRows(rows.filter((row) => row.id !== id));
              Swal.fire({
                title: `משתמש "${userFullName}" נמחק בהצלחה!`,
                text: "",
                icon: "success",
                confirmButtonText: "אישור",
                customClass: {
                  container: "swal-dialog-custom",
                },
              }).then((result) => {});
            } catch (error) {
              Swal.fire({
                title: `לא ניתן למחוק את המשתמש`,
                text: error,
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "אישור",
                reverseButtons: true,
                customClass: {
                  container: "swal-dialog-custom",
                },
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
          customClass: {
            container: "swal-dialog-custom",
          },
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
        await changePassword(loggedUserId, selectedUserId, newPassword);
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

    const { id, privateNumber, fullName, commandName, editPerm, managePerm } =
      updatedRow;

    try {
      const filteredUser = {
        privateNumber,
        fullName,
        nifgaimCommandId: await getCommandIdByName(commandName),
        editPerm,
        managePerm,
      };

      await updateUser(loggedUserId, id, filteredUser);

      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

      return updatedRow;
    } catch (error) {
      Swal.fire({
        title: `אחד מהנתונים שהזנת אינו תקין, נסה שנית`,
        text: "",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "אישור",
        reverseButtons: true,
        customClass: {
          container: "swal-dialog-custom",
        },
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
      field: "commandName",
      headerName: "פיקוד",
      headerAlign: "center",
      tfontColor: "white",
      type: "singleSelect",
      align: "center",
      editable: true,
      flex: 1,
      valueOptions: commands,
      valueFormatter: ({ value }) => {
        const option = commands.find(
          ({ value: optionValue }) => optionValue === value
        );
        return option ? option.label : value; // Return the label if found, otherwise return the original value
      },
    },

    {
      field: "editPerm",
      headerName: "הרשאות עריכה",
      headerAlign: "center",
      type: "boolean",
      editable: true,
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <span style={{ color: "green", fontSize: "1.2rem" }}>✓</span>
        ) : (
          <span style={{ color: "red", fontSize: "1.2rem" }}>✗</span>
        ),
    },
    {
      field: "managePerm",
      headerName: "הרשאות ניהול",
      headerAlign: "center",
      type: "boolean",
      editable: true,
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <span style={{ color: "green", fontSize: "1.2rem" }}>✓</span>
        ) : (
          <span style={{ color: "red", fontSize: "1.2rem" }}>✗</span>
        ),
    },

    {
      field: "actions",
      type: "actions",
      headerName: "פעולות",
      headerAlign: "center",
      flex: 1.5,
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
        width: "80vw",
        height: "80vh",
        marginTop: "5vh",
        overflow: "auto",
        "@media screen and (max-width: 1200px)": {
          width: "100vw",
          height: "75vh",
          maxHeight: "40rem",
          maxWidth: "60rem",
        },
        "@media screen and (max-width: 1050px)": {
          width: "70vw",
          height: "75vh",
          maxHeight: "40rem",
          maxWidth: "60rem",
        },
        direction: "ltr",
        background: "white",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "2rem",
        boxShadow: "5px 5px 31px 5px rgba(0, 0, 0, 0.75)",

        "& .MuiDataGrid-virtualScrollerContent > .MuiDataGrid-virtualScrollerRenderZone":
          {
            position: "absolute !important",
          },
        "& .MuiDataGrid-virtualScroller": {
          minWidth: "fit-content !important",
        },
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
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        pageSizeOptions={[5, 10, 25, 100]}
        slots={{
          toolbar: CustomToolBarManageUsers,
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        slotProps={{
          toolbar: {
            setRows,
            rows,
            columns,
            setRowModesModel,
            commands,
          },
        }}
      />
      {open && (
        <ResetPasswordDialog
          open={open}
          setOpen={setOpen}
          selectedFullName={selectedFullName}
          userLoginInfo={userLoginInfo}
          handleChangePasswordRegister={handleChangePasswordRegister}
          handleChangeConfirmRegister={handleChangeConfirmRegister}
          handleUpdatePassword={handleUpdatePassword}
        />
      )}
    </Box>
  );
}
