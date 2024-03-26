import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { heIL } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { getLeftOvers } from "../../utils/api/leftOversApi";
import { getHalalById, getHalals } from "../../utils/api/halalsApi";
import EditLeftOverDialog from "./EditLeftOverDialog";
import CustomNoRowsOverlay from "../../components/TableUtils/CustomNoRowsOverlay";
import CustomToolBarLeftOver from "../../components/LeftOversTable/CustomToolBarLeftOver";
import "./ManageLeftOversPage.css";
import { useState } from "react";
import { getUserById } from "../../utils/api/usersApi";
import { useEffect } from "react";

export default function ManageLeftOversPage() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editPerm, setEditPerm] = useState("");
  const [managePerm, setManagePerm] = useState("");
  const [halals, setHalals] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";

  const handleRowClick = (params) => {
    if (editPerm || managePerm) {
      setSelectedRow(params.row);
      setOpenDialog(true);
    }
  };

  useEffect(() => {
    const fetchDataLeftOver = async () => {
      setLoading(true);
      try {
        const leftOversData = await getLeftOvers();

        const leftOversPromises = [];

        for (const leftOver of leftOversData) {
          // Pushing promises for halal data into the array
          leftOversPromises.push(
            getHalalById(leftOver.nifgaimHalalId).then((halalData) => ({
              id: leftOver.id,
              fullName: leftOver.fullName,
              halalId: halalData.privateNumber,
              halalFullName: halalData.lastName + " " + halalData.firstName,
              proximity: leftOver.proximity,
              city: leftOver.city,
              address: leftOver.address,
              phone: leftOver.phone,
              comments: leftOver.comments,
              isReligious: leftOver.isReligious,
            }))
          );
        }

        const transformedLeftOvers = await Promise.all(leftOversPromises);
        const sortedRows = [...transformedLeftOvers].sort(
          (a, b) => a.privateNumber - b.privateNumber
        );
        setRows(sortedRows);

        const user = await getUserById(loggedUserId);

        setEditPerm(user.editPerm);
        setManagePerm(user.managePerm);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching or transforming users:", error);
      }
    };

    fetchDataLeftOver();
  }, [loggedUserId]);

  useEffect(() => {
    const fetchHalalsData = async () => {
      try {
        let halalim = await getHalals();
        halalim.sort((a, b) => a.privateNumber - b.privateNumber);
        setHalals(halalim);

        // setLoading(false);
      } catch (error) {
        console.error("Error fetching halals:", error);
      }
    };

    fetchHalalsData();
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
      field: "proximity",
      headerName: "קרבה",
      headerAlign: "center",
      type: "string",
      editable: false,
      flex: 1,
      align: "center",
    },
    {
      field: "city",
      headerName: "עיר",
      headerAlign: "center",
      type: "string",
      editable: false,
      flex: 1,
      align: "center",
    },
    {
      field: "address",
      headerName: "כתובת",
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
      field: "isReligious",
      headerName: "דת",
      headerAlign: "center",
      type: "boolean",
      editable: false,
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <span style={{ color: "green", fontSize: "1.2rem" }}>✓</span>
        ) : (
          <span style={{ color: "red", fontSize: "1.2rem" }}>✗</span>
        ),
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
  ];

  return (
    <Box
      sx={{
        width: "80vw",
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
        onRowClick={handleRowClick}
        rowModesModel={rowModesModel}
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
          pagination: { paginationModel: { pageSize: 10 } },
          sortModel: [{ field: "halalId", sort: "asc" }], // Set default sorting by halalId in ascending order
        }}
        pageSizeOptions={[5, 10, 25]}
        slots={{
          toolbar: CustomToolBarLeftOver,
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        slotProps={{
          toolbar: {
            rows,
            setRows,
            columns,
            setRowModesModel,
            editPerm,
            managePerm,
            halals,
          },
        }}
      />

      {selectedRow && openDialog && (
        <EditLeftOverDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          selectedRow={selectedRow}
          setRows={setRows}
          rows={rows}
          halals={halals}
        />
      )}
    </Box>
  );
}
