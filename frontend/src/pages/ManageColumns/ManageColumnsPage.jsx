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
} from "../../utils/api/halalsApi";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import SimpleDialog from "../../components/Dialog";

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

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handelOpenDialog = () => {
    setOpenDialog(true);
  };
  useEffect(() => {
    const fetchColumnsData = async () => {
      try {
        const columnsWithAllData = await getHalalColumnsAndTypes(); // changed from getCommands

        const originColumns = await getOriginalColumns();

        console.log(columnsWithAllData);
        console.log(originColumns);
        setOriginalColumns(originColumns);
        const columns = columnsWithAllData.map((column) => {
          return {
            columnName: column.column_name,
            columnType: column.data_type,
            columnDefault: column.column_default,
          };
        });

        setColumns(columns); // changed from setCommands
      } catch (error) {
        console.error("Error during get columns:", error); // changed from get commands
      }
    };

    fetchColumnsData();
  }, []);

  const handelColumnNameChange = async (
    columnName,
    newName,
    newType,
    newDefaultValue
  ) => {
    try {
      console.log(loggedUserId, columnName, newName, newDefaultValue);
      await updateHalalColumn(
        loggedUserId,
        columnName,
        newName,
        newDefaultValue
      ); // changed from updateCommandById
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
    console.log(newColumnName, typeOfColumn, defaultValue);
    // changed from handelAddCommand
    if (newColumnName !== "") {
      try {
        await addHalalColumn(
          loggedUserId,
          newColumnName,
          typeOfColumn,
          defaultValue
        ); // changed from createCommand
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

  console.log("sortedFilteredColumns");
  console.log(sortedFilteredColumns);

  return (
    <div className="columnsContainer">
      {/* changed from commandsContainer */}
      <div className="columnsHeader">
        {/* changed from commandsHeader */}
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
        {/* changed from commands-list */}
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
