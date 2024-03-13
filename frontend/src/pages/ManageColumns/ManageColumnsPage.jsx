import React, { useEffect, useRef, useState } from "react";
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
  getColumnEnums,
  getHalalColumnsAndTypes,
  getOriginalColumns,
  updateHalalColumn,
  updateHalalSelectColumn,
} from "../../utils/api/halalsApi";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import SimpleDialog from "../../components/Dialog";
import dayjs from "dayjs";
import { filterColumns, handleDataTypeName, handleDefaultValue, removeQuotes } from "../../utils/utilsForCulomnPage";

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
  const [sortColumns, setSortColumns] = useState([]);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      setSortColumns(filterColumns(columns, searchInputValue, originalColumns));
    }
  }, [columns, searchInputValue, originalColumns, setSortColumns]);

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

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handelOpenDialog = () => {
    setOpenDialog(true);
  };

  useEffect(() => {
    const fetchColumnsData = async () => {
      setLoading(true);
      try {
        const columnsWithAllData = await getHalalColumnsAndTypes(); // changed from getCommands

        const originColumns = await getOriginalColumns();

        setOriginalColumns(originColumns);
        const columns = columnsWithAllData.map(async (column) => {
          const columnType = handleDataTypeName(column.data_type);
          let arrayEnum;
          let result;
          if (columnType === "ENUM") {
            const columnEnums = await getColumnEnums(column.column_name);

            result = removeQuotes(columnEnums);
            arrayEnum = result.slice(1, -1).split(",");
          }
          const defaultValue = handleDefaultValue(
            column.column_default,
            columnType
          );

          return {
            columnName: column.column_name,
            columnType: columnType,
            columnDefault: defaultValue,
            enumValues: columnType === "ENUM" ? arrayEnum : null,
          };
        });

        setColumns(await Promise.all(columns));

        // setColumns(columns); // changed from setCommands

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
    newDefaultValue,
    newEnums
  ) => {
    try {
      if (columnType === "ENUM") {
        console.log(columnName, newName, newEnums, newDefaultValue);

        await updateHalalSelectColumn(
          loggedUserId,
          columnName,
          newName,
          newEnums,
          newDefaultValue
        );
      } else {
        await updateHalalColumn(
          loggedUserId,
          columnName,
          newName,
          columnType === "DATE"
            ? dayjs(newDefaultValue, "DD/MM/YYYY")
            : newDefaultValue,
          columnType
        ); // changed from updateCommandById
      }

      setColumns((prevColumns) => {
        return prevColumns.map((column) => {
          if (column.columnName === columnName) {
            console.log(newDefaultValue);
            return {
              ...column,
              columnName: newName,
              defaultValue: newDefaultValue,
            };
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

  const handelAddColumn = async (
    newColumnName,
    typeOfColumn,
    defaultValue,
    enumValues
  ) => {
    if (newColumnName !== "") {
      try {
        await addHalalColumn(
          loggedUserId,
          newColumnName,
          typeOfColumn,
          typeOfColumn === "DATE"
            ? dayjs(defaultValue, "DD/MM/YYYY")
            : defaultValue
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
            enumValues: typeOfColumn === "ENUM" ? enumValues : null,
          },
        ]);
        setSearchInputValue("");

        setOpenDialog(false);
      } catch (error) {
        const errors = error.response.data.body?.errors;
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

  console.log("the component render");
  // console.log(sortedFilteredColumns);
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
        {sortColumns.map((column) => (
          <li key={column.columnName}>
            <EditableItem
              isColumn={true}
              isNewColumn={originalColumns.some(
                (originColumn) => originColumn === column.columnName
              )}
              itemName={translationDict[column.columnName] || column.columnName} // Use translated value if available, otherwise use the original column name
              itemId={column.columnName}
              defaultValue={column.columnDefault}
              handleItemNameChange={handelColumnNameChange}
              handleDeleteItem={handleDeleteColumn}
              isNewItem={column.isNewItem ? true : false}
              columnType={column.columnType}
              enumValues={column.enumValues}
            />
          </li>
        ))}
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
