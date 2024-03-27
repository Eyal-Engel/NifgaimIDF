import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { heIL } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import "./HalalimPage.css";
import {
  getColumnEnums,
  getHalalColumnsAndTypes,
  getHalals,
  getOriginalColumns,
  replaceColumnValue,
  resetColumnToDefault,
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
import pLimit from "p-limit";
import { IconButton } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import MagicButtonDialog from "./MagicButtonDialog";
export default function HalalimPage() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  // const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [originalColumns, setOriginalColumns] = useState([]);
  const [allDataOfHalalsColumns, setAllDataOfHalalsColumns] = useState([]);
  const [commands, setCommands] = useState([]);
  const [graveyards, setGraveyards] = useState([]);
  const [editPerm, setEditPerm] = useState("");
  const [managePerm, setManagePerm] = useState("");
  const [enums, setEnums] = useState({});

  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";

  const handleRowClick = (params) => {
    if (editPerm || managePerm) {
      setSelectedRow(params.row);
      setOpenDialog(true);
    }
  };

  function removeQuotes(inputString) {
    // Remove the overall quotes from the input string
    inputString = inputString.replace(/^{|"|}$/g, "");

    // Split the input string by commas and remove leading/trailing whitespaces
    const items = inputString.split(",").map((item) => item.trim());

    // Remove double quotes from the first and last character of each item if they are present
    const itemsWithoutQuotes = items.map((item) => {
      if (item.startsWith('"') && item.endsWith('"')) {
        return item.slice(1, -1); // Remove quotes from the beginning and end
      }
      return item;
    });

    // Join the items back into a string and return
    return `{${itemsWithoutQuotes.join(",")}}`;
  }

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

  useEffect(() => {
    const fetchData = async () => {
      let enumsObject = {};
      let result;
      let arrayEnum;

      // Fetch column enums
      for (const column of allDataOfHalalsColumns) {
        if (column.data_type === "USER-DEFINED") {
          const columnEnums = await getColumnEnums(column.column_name);
          if (columnEnums) {
            // const enumArray = columnEnums
            //   .replace(/[{}]/g, "")
            //   .split(",")
            //   .map((item) => item.trim());
            result = removeQuotes(columnEnums);
            arrayEnum = result.slice(1, -1).split(",");
            enumsObject[column.column_name] = arrayEnum;
          } else {
            enumsObject[column.column_name] = [];
          }
        }
      }

      setEnums(enumsObject);
    };
    fetchData();
  }, [allDataOfHalalsColumns]);

  const formatDate = React.useCallback((date) => {
    if (!date) {
      return ""; // Return empty string if date is falsy (null, undefined, etc.)
    }

    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  const fetchHalalData = async (halal) => {
    const graveyard = await getGraveyardById(halal.nifgaimGraveyardId);
    const command = await getCommandById(halal.nifgaimCommandId);

    return {
      ...halal,
      nifgaimGraveyardId: graveyard.graveyardName,
      nifgaimCommandId: command.commandName,
    };
  };

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
          const width = calculatedWidth > 120 ? calculatedWidth + 30 : 120 + 30;

          let type = column.data_type;
          // Check if the type is 'date' and format accordingly

          let renderCell1;
          if (type === "boolean") {
            renderCell1 = (params) => (
              <div style={{ textAlign: "center" }}>
                {params.value === true ? (
                  <span style={{ color: "green", fontSize: "1.2rem" }}>✓</span>
                ) : params.value === false ? (
                  <span style={{ color: "red", fontSize: "1.2rem" }}>✗</span>
                ) : null}
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
            // headerName: translatedHeader, // Use translated header
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

      // Limit concurrent requests here
      const limit = pLimit(250); // Adjust the concurrency limit as per your requirements
      const halalsData = await getHalals();
      const halalsPromises = halalsData.map((halal) =>
        limit(() => fetchHalalData(halal))
      );
      const transformedHalals = await Promise.all(halalsPromises);

      setColumns(formattedColumns);
      setRows(transformedHalals);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching column data:", error);
    }
  }, [formatDate]);

  useEffect(() => {
    fetchColumnsData();
  }, [fetchColumnsData]);
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
          minWidth: "fit-content !important",
        },
      }}
    >
      <DataGrid
        rows={rows}
        loading={loading}
        columns={columns.filter(
          (column) => column.field !== "מספר זיהוי" && column.field !== "id"
        )}
        editMode="row"
        pagination
        columnBuffer={columns.length}
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
            enums,
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
          enums={enums}
        />
      )}
    </Box>
  );
}
