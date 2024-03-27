import React, { useEffect, useRef, useState } from "react";
import { Button, TextField, ThemeProvider, createTheme } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import ReuseableItem from "../../components/ReuseableItem";
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
import ReusableCreateItemDialog from "../../components/ReusableCreateItemDialog";
import dayjs from "dayjs";
import {
  filterColumns,
  handleDataTypeName,
  handleDefaultValue,
  removeQuotes,
} from "../../utils/utilsForCulomnPage";

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
      setLoading(true);
      setSortColumns(filterColumns(columns, searchInputValue, originalColumns));
      setLoading(false);
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
      Swal.fire({
        title: `עמודה "${newName}" עודכנה בהצלחה!`,
        text: "",
        icon: "success",
        confirmButtonText: "אישור",
        customClass: {
          container: "swal-dialog-custom",
        },
      }).then((result) => {});
    } catch (error) {
      console.log(error);
      const errors = error.response.data.body?.errors;
      let errorsForSwal = ""; // Start unordered list

      if (errors) {
        errors.forEach((error) => {
          if (error.message === "columnName must be unique") {
            errorsForSwal += "<li>השם כבר קיים במערכת</li>";
          }
          if (
            error.message ===
            "at least 1 of new column name or columnDefault are required."
          ) {
            errorsForSwal += "<li>נדרש להכניס שם וערך ברירת מחדל</li>";
          }
          if (error.message === `Column '${columnName}' does not exist.`) {
            errorsForSwal += "<li>השם לא קיים במערכת</li>";
          }
          if (
            error.message ===
            `New column name and new enum values are required.`
          ) {
            errorsForSwal += "<li>נדרש להכניס שם וערך ברירת מחדל</li>";
          }
        });
      } else {
        errorsForSwal += `<li>${error}</li>`;
      }

      Swal.fire({
        title: ` לא ניתן ליצור את העמודה ${newName}`, // changed from command
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
            title: `עמודה "${columnName}" נמחקה בהצלחה!`, // changed from commandName
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
    try {
      await addHalalColumn(
        loggedUserId,
        newColumnName.trim(),
        typeOfColumn,
        typeOfColumn === "DATE"
          ? dayjs(defaultValue, "DD/MM/YYYY")
          : defaultValue
      ); // changed from createCommand
      if (typeOfColumn.includes("select")) {
        typeOfColumn = "ENUM";
      }

      if (
        defaultValue === "" ||
        defaultValue === null ||
        defaultValue === undefined
      ){
        defaultValue = "לא הוגדר ערך ברירת מחדל"
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
      Swal.fire({
        title: `עמודה "${newColumnName}" נוצרה בהצלחה!`,
        text: "",
        icon: "success",
        confirmButtonText: "אישור",
        customClass: {
          container: "swal-dialog-custom",
        },
      }).then(() => {
        setSearchInputValue("");
        setOpenDialog(false);
      });
    } catch (error) {
      console.log(error);
      const errors = error.response.data.body?.errors;
      let errorsForSwal = ""; // Start unordered list
      console.log(errors);
      if (errors) {
        errors.forEach((error) => {
          if (
            error.message === `Column '${newColumnName.trim()}' already exists.`
          ) {
            errorsForSwal += "<li>העמודה כבר קיימת במערכת</li>";
          }
          if (
            error.message ===
            `Default value '${defaultValue}' is not valid for data type '${typeOfColumn}'.`
          ) {
            errorsForSwal += "<li>ערך ברירת מחדל לא תקין</li>";
          }
          if (error.message === "Column name is required.") {
            errorsForSwal += "<li>נדרש להכניס שם עמודה</li>";
          }
          if (error.message === "Data type is required.") {
            errorsForSwal += "<li>נדרש להכניס סוג עמודה</li>";
          }
          if (error.message === "enumlabel must be unique") {
            errorsForSwal += "<li>הכנסת ערכים דומים, שנה אחד מהם</li>";
          }
        });
      } else {
        errorsForSwal += `<li>${error}</li>`;
      }

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
                inputProps={{ maxLength: "7" }}
              />
            </div>
          </ThemeProvider>
        </CacheProvider>
      </div>
      <ul className="columns-list">
        {sortColumns.map((column) => (
          <li key={column.columnName}>
            <ReuseableItem
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
        <ReusableCreateItemDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onCreateClicked={handelAddColumn} // changed from handelAddCommand
          isColumn={true}
        />
      </div>
    </div>
  );
}
