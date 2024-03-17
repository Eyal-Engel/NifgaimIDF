import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { heIL } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import "./HalalimPage.css";
import {
  getHalalColumnsAndTypes,
  getHalals,
  getOriginalColumns,
} from "../../utils/api/halalsApi";
import EditHalalDialog from "./EditHalalDialog";
import {
  getAllCommandsNames,
  getCommandById,
} from "../../utils/api/commandsApi";
import {
  getAllGraveyards,
  getGraveyardById,
} from "../../utils/api/graveyardsApi";
import { useEffect } from "react";
import { useState } from "react";
import HalalimCustomToolBar from "../../components/halalimTable/HalalimCustomToolBar";
import CustomNoRowsOverlay from "../../components/TableUtils/CustomNoRowsOverlay";
import { getUserById } from "../../utils/api/usersApi";

export default function HalalimPage() {
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  // const [commands, setCommands] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [originalColumns, setOriginalColumns] = React.useState([]);
  const [allDataOfHalalsColumns, setAllDataOfHalalsColumns] = React.useState(
    []
  );
  const [commands, setCommands] = useState([]);
  const [graveyards, setGraveyards] = useState([]);
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
    const fetchCommandsAndGraveyardsData = async () => {
      try {
        const commandsNames = await getAllCommandsNames();
        setCommands(commandsNames);

        const graveyardsNames = await getAllGraveyards();
        setGraveyards(graveyardsNames);

        const user = await getUserById(loggedUserId);

        setEditPerm(user.editPerm);
        setManagePerm(user.managePerm);
      } catch (error) {
        console.error("Error during get commands:", error);
      }
    };

    fetchCommandsAndGraveyardsData();
  }, [loggedUserId]);

  const formatDate = React.useCallback((date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  const fetchColumnsData = React.useCallback(async () => {
    const translationDict = {
      id: "מספר זיהוי",
      privateNumber: "מספר אישי",
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
      nifgaimGraveyardId: "בית קברות",
      nifgaimCommandId: "פיקוד",
    };

    setLoading(true);
    try {
      // Replace this with your actual method to fetch column data
      const currentColumns = await getHalalColumnsAndTypes(); // This should fetch your columns data
      const origin = await getOriginalColumns();
      setOriginalColumns(origin);
      setAllDataOfHalalsColumns(currentColumns);
      // Sort the columns alphabetically by column name
      currentColumns.sort((a, b) => a.column_name.localeCompare(b.column_name));

      // Create an array for the sorted columns with originalColumns first

      const sortedColumns = origin
        .map((columnName) => {
          const column = currentColumns.find(
            (col) => col.column_name === columnName
          );
          return column || null; // Return null if no match is found
        })
        .filter(Boolean);

      // Append any additional columns that are not in originalColumns
      currentColumns.forEach((column) => {
        if (!origin.includes(column.column_name)) {
          sortedColumns.push(column);
        }
      });

      const formattedColumns = sortedColumns.reduce((acc, column) => {
        // Exclude the column with the ID
        if (column) {
          const translatedHeader =
            translationDict[column.column_name] || column.column_name; // Translate header if available

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
                      ? "rgba(0, 200, 255, 0.8)" // Cyan with 80% opacity
                      : "rgba(40, 40, 40, 0.15)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden", // Ensure content is clipped if it overflows
                  paddingLeft: "10px", // Adjust padding as needed
                  paddingRight: "10px", // Adjust padding as needed
                }}
                title={params.value} // Tooltip to show full text on hover
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
                    margin: 0, // Remove default margin
                    overflow: "hidden", // Ensure text is clipped if it overflows
                    textOverflow: "ellipsis", // Show ellipsis if text overflows container
                    whiteSpace: "nowrap", // Prevent text from wrapping
                    maxWidth: "100%", // Ensure text doesn't overflow container
                  }}
                >
                  {params.value}
                </p>
              </div>
            );
          }

          acc.push({
            field: column.column_name,
            headerName: translatedHeader, // Use translated header
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
          });
        }
        return acc;
      }, []);
      // .reverse();

      const halalsData = await getHalals();

      const halalsPromises = halalsData.map(async (halal) => {
        // Using async/await within map to transform each halal item
        const graveyard = await getGraveyardById(halal.nifgaimGraveyardId);
        const command = await getCommandById(halal.nifgaimCommandId);

        return {
          ...halal,
          nifgaimGraveyardId: graveyard.graveyardName,
          nifgaimCommandId: command.commandName,
        };
      });

      const transformedHalals = await Promise.all(halalsPromises);

      setColumns(formattedColumns);
      setRows(transformedHalals);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching column data:", error);
    }
  }, [formatDate]);

  React.useEffect(() => {
    fetchColumnsData();
  }, [fetchColumnsData]);
  // }, [allDataOfHalalsColumns]);
  console.log("the component rernder");
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
          minWidth:
            // ? "880px !important":
            "fit-content !important",
        },
      }}
    >
      <DataGrid
        rows={rows}
        loading={loading}
        columns={columns.filter(
          (column) => column.field !== "מספר זיהוי" && column.field !== "id"
        )} // Exclude the 'id' field
        editMode="row"
        pagination
        columnBuffer={columns.length}
        onRowClick={handleRowClick}
        rowModesModel={rowModesModel}
        localeText={heIL.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          direction: "rtl",
          // overflow: "hidden",
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
        }}
        pageSizeOptions={[5, 10, 25]}
        slots={{
          toolbar: HalalimCustomToolBar,
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        slotProps={{
          toolbar: {
            setRows,
            rows,
            columns,
            allDataOfHalalsColumns,
            setRowModesModel,
            originalColumns,
            commands,
            graveyards,
            editPerm,
            managePerm,
          },
        }}
      />
      {selectedRow && (
        <EditHalalDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          selectedRow={selectedRow}
          allDataOfHalalsColumns={allDataOfHalalsColumns}
          originalColumns={originalColumns}
          setRows={setRows}
          rows={rows}
          commands={commands}
          graveyards={graveyards}
        />
      )}
    </Box>
  );
}
