import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { heIL } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import "./ManageSoldierAccompaniedPage.css";
import { getHalalById } from "../../utils/api/halalsApi";
import EditSoldierAccompaniedDialog from "./EditSoldierAccompaniedDialog";
import { getSoldierAccompanieds } from "../../utils/api/soldierAccompaniedsApi";
import CustomNoRowsOverlay from "../../components/TableUtils/CustomNoRowsOverlay";
import CustomToolBarSoliderAccompanied from "../../components/SoliderAccompaniedTable/CustomToolBarSoliderAccompanied";
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
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";

  const handleRowClick = (params) => {
    if (editPerm || managePerm) {
      setSelectedRow(params.row);
      setOpenDialog(true);
    }
  };

  useEffect(() => {
    const fetchDataSoldierAccompanieds = async () => {
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
        const sortedRows = [...transformedSoldierAccompanieds].sort(
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

    fetchDataSoldierAccompanieds();
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
          toolbar: CustomToolBarSoliderAccompanied,
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
          },
        }}
      />

      {selectedRow && openDialog && (
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
