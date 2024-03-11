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
} from "@mui/material";
import "./ManageSoldierAccompaniedPage.css";
import Slide from "@mui/material/Slide";
import Draggable from "react-draggable";
import { validationPasswordsErrorType } from "../../utils/validators";
import { AiOutlineCloseCircle, AiOutlineDrag } from "react-icons/ai";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import { PasswordStrength } from "../../components/manageUsers/PasswordStrength";
import { deleteLeftOver, getLeftOvers } from "../../utils/api/leftOversApi";
import { getHalalById } from "../../utils/api/halalsApi";
import CreateSoldierAccompaniedDialog from "./CreateSoldierAccompaniedDialog";
import EditSoldierAccompaniedDialog from "./EditSoldierAccompaniedDialog";
import { getSoldierAccompanieds } from "../../utils/api/soldierAccompaniedsApi";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

function CustomToolbar({ rows, setRows, columns }) {
  const [openCreateNewLeftOver, setOpenCreateNewLeftOver] =
    React.useState(false);

  const handleCreateNewLeftOver = () => {
    setOpenCreateNewLeftOver(true);
  };

  const handleExportToExcel = () => {
    const data = rows.map((row) =>
      columns.map((col) => {
        const value = row[col.field];
        if (typeof value === "boolean") {
          return value ? "כן" : "לא";
        }
        return value;
      })
    );

    const ws = XLSX.utils.aoa_to_sheet([
      columns.map((col) => col.headerName),
      ...data,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "נפגעים - מלווים.xlsx"
    );
  };

  return (
    <>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleCreateNewLeftOver}
        sx={{
          paddingRight: "80px",
          borderRadius: "5000px 5000px 0 0",

          "& .MuiButton-startIcon": {
            marginLeft: "-120px",
          },
          "&:hover": {
            backgroundColor: "#EDF3F8",
          },
        }}
      >
        יצירת מלווה חדש
      </Button>
      <CreateSoldierAccompaniedDialog
        openDialog={openCreateNewLeftOver}
        setOpenDialog={setOpenCreateNewLeftOver}
        rows={rows}
        setRows={setRows}
      />
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

export default function ManageLeftOversPage() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [commands, setCommands] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [selectedFullName, setSelectedFullName] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setOpenDialog(true);
  };

  React.useEffect(() => {
    const fetchDataUsers = async () => {
      setLoading(true);
      try {
        // Fetch soldierAccompanieds data
        const soldierAccompaniedsData = await getSoldierAccompanieds();

        // Create an array to store promises for fetching halal data
        const soldierAccompaniedsPromises = [];

        // Iterate over soldierAccompaniedsData to create promises for halal data
        for (const soldierAccompanieds of soldierAccompaniedsData) {
          // Pushing promises for halal data into the array
          soldierAccompaniedsPromises.push(
            getHalalById(soldierAccompanieds.nifgaimHalalId).then(
              (halalData) => ({
                id: soldierAccompanieds.id,
                fullName: soldierAccompanieds.fullName,
                halalId: halalData.privateNumber,
                halalFullName: halalData.lastName + " " + halalData.firstName,
                privateNumber: soldierAccompanieds.privateNumber,
                rank: soldierAccompanieds.rank,
                phone: soldierAccompanieds.phone,
                unit: soldierAccompanieds.unit,
                comments: soldierAccompanieds.comments,
              })
            )
          );
        }

        // Wait for all promises to resolve
        const transformedSoldierAccompanieds = await Promise.all(
          soldierAccompaniedsPromises
        );

        // Update state with transformed data
        setRows(transformedSoldierAccompanieds);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching or transforming users:", error);
      }
    };

    fetchDataUsers();
  }, []);

  React.useEffect(() => {
    const sortedRows = [...rows].sort(
      (a, b) => a.privateNumber - b.privateNumber
    );
    setRows(sortedRows);
  }, [rows]);

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

  const columns = [
    {
      field: "fullName",
      headerName: "שם מלא",
      headerAlign: "center",
      align: "center",
      type: "string",
      editable: false,
      flex: 1,
    },
    {
      field: "halalId",
      headerName: "מספר אישי של החלל",
      headerAlign: "center",
      align: "center",
      type: "string",
      editable: false,
      flex: 1,
    },
    {
      field: "halalFullName",
      headerName: "שם מלא של החלל",
      headerAlign: "center",
      align: "center",
      type: "string",
      editable: false,
      flex: 1,
    },
    {
      field: "privateNumber",
      headerName: "מספר אישי",
      headerAlign: "center",
      type: "string",
      editable: false,
      flex: 1,
      align: "center",
    },
    {
      field: "rank",
      headerName: "דרגה",
      headerAlign: "center",
      type: "string",
      editable: false,
      flex: 1,
      align: "center",
    },
    {
      field: "phone",
      headerName: "מספר טלפון",
      headerAlign: "center",
      type: "string",
      editable: false,
      flex: 1,
      align: "center",
      renderCell: (params) => {
        const words = params.value.split(" ");
        if (words.length > 0) {
          const firstWord = words[0];
          if (firstWord.length > 1) {
            const lastChar = firstWord.charAt(0);
            words[0] = firstWord.substring(1, firstWord.length) + lastChar;
          }
        }
        const reversedWords = words.reverse().join(" ");
        return <div>{reversedWords}</div>;
      },
    },
    {
      field: "unit",
      headerName: "יחידה",
      headerAlign: "center",
      type: "string",
      editable: false,
      flex: 1,
      align: "center",
    },
    {
      field: "comments",
      headerName: "הערות",
      headerAlign: "center",
      type: "string",
      editable: false,
      flex: 1,
      align: "center",
    },
    // {
    //   field: "actions",
    //   type: "actions",
    //   headerName: "פעולות",
    //   headerAlign: "center",
    //   flex: 1,
    //   cellClassName: "actions",
    //   getActions: ({ id }) => {
    //     const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

    //     if (isInEditMode) {
    //       return [
    //         <GridActionsCellItem
    //           icon={<SaveIcon />}
    //           label="Save"
    //           color="primary"
    //           onClick={handleSaveClick(id)}
    //         />,
    //         <GridActionsCellItem
    //           icon={<CancelIcon />}
    //           label="Cancel"
    //           className="textPrimary"
    //           onClick={handleCancelClick(id)}
    //           color="error"
    //         />,
    //       ];
    //     }

    //     return [
    //       <GridActionsCellItem
    //         icon={<EditIcon />}
    //         label="Edit"
    //         className="textPrimary"
    //         onClick={handleEditClick(id)}
    //         color="primary"
    //       />,
    //       <GridActionsCellItem
    //         icon={<DeleteIcon />}
    //         label="Delete"
    //         onClick={handleDeleteClick(id)}
    //         color="error"
    //       />,
    //     ];
    //   },
    // },
  ];

  return (
    <Box
      sx={{
        width: "100vw",
        height: "75vh",
        maxHeight: "70rem",
        maxWidth: "70rem",
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
          sortModel: [{ field: "halalId", sort: "asc" }], // Set default sorting by halalId in ascending order
        }}
        pageSizeOptions={[5, 10, 25]}
        slots={{
          toolbar: CustomToolbar,
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        slotProps={{
          toolbar: { rows, setRows, columns, setRowModesModel },
        }}
      />

      {selectedRow && (
        <EditSoldierAccompaniedDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          selectedRow={selectedRow}
          setRows={setRows}
          rows={rows}
        />
      )}
    </Box>
  );
}
