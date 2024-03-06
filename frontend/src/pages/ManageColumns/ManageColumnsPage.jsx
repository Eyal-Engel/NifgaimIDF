import React, { useEffect, useState } from "react";
import { Button, TextField, ThemeProvider, createTheme } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import EditableItem from "../../components/reuseableItem";
import "./ManageColumnsPage.css";
import {
  addHalalColumn,
  deleteHalalColumn,
  getHalalColumnsAndTypes,
  getOriginalColumns,
  updateHalalColumn,
  updateHalalSelectColumn,
} from "../../utils/api/halalsApi";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import SimpleDialog from "../../components/Dialog";
import dayjs from "dayjs";

const theme = createTheme({
  direction: "rtl",
});

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function ManageColumnsPage() {
  const [columns, setColumns] = useState([]); // changed from commands
  const [searchInputValue, setSearchInputValue] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";
  const [originalColumns, setOriginalColumns] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handelOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleDataTypeName = (dataType) => {
    switch (dataType) {
      case "character varying":
        return "STRING";
      case "timestamp with time zone":
        return "DATE";
      case "boolean":
        return "BOOLEAN";
      case "USER-DEFINED":
        return "ENUM";
      case "integer":
        return "INTEGER";
      case "uuid":
        return "UUID";

      default:
        break;
    }
  };
  useEffect(() => {
    const fetchColumnsData = async () => {
      setLoading(true);
      try {
        const columnsWithAllData = await getHalalColumnsAndTypes(); // changed from getCommands

        const originColumns = await getOriginalColumns();

        setOriginalColumns(originColumns);
        const columns = columnsWithAllData.map((column) => {
          const columnType = handleDataTypeName(column.data_type);
          return {
            columnName: column.column_name,
            columnType: columnType,
            columnDefault: column.column_default,
          };
        });

        setColumns(columns); // changed from setCommands

        setLoading(false); // Data fetching completed, set loading to false
      } catch (error) {
        console.error("Error during get columns:", error); // changed from get commands
      }
    };

    fetchColumnsData();
  }, []);

  if (loading) {
    return <span className="loader"></span>; // Render loading indicator
  }

  const handelColumnNameChange = async (
    columnName,
    newName,
    columnType,
    newDefaultValue
  ) => {
    try {
      if (columnType === "ENUM") {
        // updateHalalSelectColumn
        const newEnum = ["value1", "value2", "value3"];
        const columnDefault = "value1";
        await updateHalalSelectColumn(
          loggedUserId,
          columnName,
          newName,
          newEnum,
          columnDefault
        );
      } else {
        await updateHalalColumn(
          loggedUserId,
          columnName,
          newName,
          newDefaultValue,
          columnType
        ); // changed from updateCommandById
      }

      setColumns((prevColumns) => {
        // changed from setCommands
        return prevColumns.map((column) => {
          // changed from command
          if (column.columnName === columnName) {
            // Update the columnName for the matching columnId  // changed from commandName
            return {
              ...column,
              columnName: newName,
              defaultValue: newDefaultValue,
            }; // changed from commandName
          }
          return column; // changed from command
        });
      });
    } catch (error) {
      const errors = error.response.data.message;

      Swal.fire({
        title: `לא ניתן לעדכן את העמודה`,
        text: errors,
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

  const handleDeleteColumn = async (columnName) => {
    // changed from handleDeleteCommand
    Swal.fire({
      title: `האם את/ה בטוח/ה שתרצה/י למחוק את העמודה ${columnName}`, // changed from commandName
      text: "פעולה זאת איננה ניתנת לשחזור",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "מחק עמודה",
      cancelButtonText: "בטל",
      reverseButtons: true,
      customClass: {
        container: "swal-dialog-custom",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteHalalColumn(loggedUserId, columnName); // changed from deleteCommandById
          setColumns((prevColumns) => {
            // changed from setCommands
            const updatedColumns = prevColumns.filter(
              (column) => column.columnName !== columnName
            );
            return updatedColumns;
          });
          Swal.fire({
            title: `עמודה "${columnName}" נמחק בהצלחה!`, // changed from commandName
            text: "",
            icon: "success",
            confirmButtonText: "אישור",
          });
        } catch (error) {
          Swal.fire({
            title: `לא ניתן למחוק את העמודה`,
            text: error,
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
    });
  };

  const handelAddColumn = async (newColumnName, typeOfColumn, defaultValue) => {
    if (newColumnName !== "") {
      try {
        await addHalalColumn(
          loggedUserId,
          newColumnName,
          typeOfColumn,
          typeOfColumn === "DATE" ? dayjs(defaultValue) : defaultValue
        ); // changed from createCommand
        if (typeOfColumn.includes("select")) {
          typeOfColumn = "ENUM";
        }
        setColumns((prev) => [
          ...prev,
          {
            columnName: newColumnName,
            columnType: typeOfColumn,
            columnDefault: defaultValue,
          },
        ]);
        setSearchInputValue("");

        setOpenDialog(false);
      } catch (error) {
        const errors = error.response.data.body.errors;
        let errorsForSwal = ""; // Start unordered list

        errors.forEach((error) => {
          if (error.message === "columnName must be unique") {
            // changed from commandName
            errorsForSwal += "<li>הפיקוד כבר קיים במערכת</li>";
          }
        });

        Swal.fire({
          title: ` לא ניתן ליצור את העמודה ${newColumnName}`, // changed from command
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
    } else {
      Swal.fire({
        title: `לא הכנסת שם עמודה `,
        text: "",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "בטל",
        reverseButtons: true,
        customClass: {
          container: "swal-dialog-custom",
        },
      });
    }
  };

  const handelSearchInput = (e) => {
    setSearchInputValue(e.target.value);
  };

  // Filter the list based on the search input
  const filteredColumns = columns.filter((column) => {
    // changed from command
    return column.columnName?.includes(searchInputValue); // changed from commandName
  });

  // Separate the columns that match the condition
  const matchingColumns = filteredColumns.filter((column) =>
    originalColumns.some((originColumn) => originColumn === column.columnName)
  );

  // Separate the columns that do not match the condition
  const nonMatchingColumns = filteredColumns.filter(
    (column) =>
      !originalColumns.some(
        (originColumn) => originColumn === column.columnName
      )
  );

  // Sort the matching columns by their position in the originalColumns array
  matchingColumns.sort(
    (a, b) =>
      originalColumns.indexOf(a.columnName) -
      originalColumns.indexOf(b.columnName)
  );

  // Combine the matching and non-matching columns
  const sortedFilteredColumns = [...nonMatchingColumns, ...matchingColumns];
  return (
    <div className="columnsContainer">
      <div className="columnsHeader">
        <h1>מאפייני חלל</h1>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <div style={{ direction: "rtl", display: "flex" }}>
              <TextField
                id="filled-search"
                label="חפש עמודה"
                type="search"
                variant="filled"
                value={searchInputValue}
                onChange={handelSearchInput}
                sx={{ zIndex: 0 }}
              />
            </div>
          </ThemeProvider>
        </CacheProvider>
      </div>
      <ul className="columns-list">
        {sortedFilteredColumns.map(
          (
            column // changed from command
          ) => (
            <li key={column.columnName}>
              <EditableItem
                isColumn={true}
                isNewColumn={originalColumns.some(
                  (originColumn) => originColumn === column.columnName
                )}
                itemName={column.columnName} // changed from commandName
                itemId={column.columnName}
                defaultValue={column.columnDefault}
                handleItemNameChange={handelColumnNameChange} // changed from handelCommandNameChange
                handleDeleteItem={handleDeleteColumn} // changed from handleDeleteCommand
                isNewItem={column.isNewItem ? true : false}
                columnType={column.columnType} // changed from commandName
              />
            </li>
          )
        )}
      </ul>
      <div>
        <Button color="secondary" onClick={handelOpenDialog}>
          <AddIcon fontSize="large"></AddIcon>
        </Button>
        <SimpleDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onCreateClicked={handelAddColumn} // changed from handelAddCommand
          isColumn={true}
        />
      </div>
    </div>
  );
}
