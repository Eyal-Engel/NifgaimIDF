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
import { Button } from "@mui/material";
import "./HalalimPage.css";
import AddIcon from "@mui/icons-material/Add";
import {
  getHalalColumnsAndTypes,
  getHalals,
} from "../../utils/api/halalsApi";
import EditHalalDialog from "./EditHalalDialog";
import CreateHalalDialog from "./CreateHalalDialog";
function CustomToolbar({ setRows, allDataOfHalalsColumns }) {
  const [openCreateNewHalal, setOpenCreateNewHalal] = React.useState(false);

  const handleCreateNewHalal = () => {
    setOpenCreateNewHalal(true);
  };

  // const handleClose = () => {
  //   setOpenCreateNewHalal(false);
  // };

  return (
    <>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleCreateNewHalal}
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
      <CreateHalalDialog
        openDialog={openCreateNewHalal}
        setOpenDialog={setOpenCreateNewHalal}
        allDataOfHalalsColumns={allDataOfHalalsColumns}
        // Add any other necessary props
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
      ></svg>
      <Box sx={{ mt: 1 }}>No Rows</Box>
    </StyledGridOverlay>
  );
}

export default function HalalimPage() {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  // const [commands, setCommands] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [allDataOfHalalsColumns, setAllDataOfHalalsColumns] = React.useState(
    []
  );

  const handleRowClick = (params) => {
    // Store the selected row
    setSelectedRow(params.row);
    // Open the dialog
    setOpenDialog(true);
  };

  React.useEffect(() => {
    // Function to fetch columns data from the API or local storage
    const fetchColumnsData = async () => {
      setLoading(true);
      try {
        // Replace this with your actual method to fetch column data
        const currentColumns = await getHalalColumnsAndTypes(); // This should fetch your columns data
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
        setColumns(formattedColumns);
        setRows(halalim);
        setLoading(false);
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
          toolbar: { setRows, allDataOfHalalsColumns, setRowModesModel },
        }}
      />
      <EditHalalDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedRow={selectedRow}
        allDataOfHalalsColumns={allDataOfHalalsColumns}
      />
    </Box>
  );
}
