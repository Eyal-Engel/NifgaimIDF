import React, { useEffect, useState } from "react";
import { Button, TextField, ThemeProvider, createTheme } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import EditableItem from "../../components/reuseableItem";
import "./ManageColumnsPage.css";
import { deleteHalalColumn, getHalalColumnsAndTypes, updateHalalColumn } from "../../utils/api/halalsApi";
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
  const [columns, setColumns] = useState([]);  // changed from commands
  const [searchInputValue, setSearchInputValue] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handelOpenDialog = () => {
    setOpenDialog(true);
  };
  useEffect(() => {
    const fetchColumnsData = async () => {  // changed from fetchCommandsData
      try {
        const columnsWithAllData = await getHalalColumnsAndTypes();  // changed from getCommands
        const columns = columnsWithAllData.map(column => {
          return {
            columnName: column.column_name,
            columnType: column.data_type
          };
        });
        console.log(columns)
         // changed from setCommands)
        setColumns(columns);  // changed from setCommands
      } catch (error) {
        console.error("Error during get columns:", error);  // changed from get commands
      }
    };

    fetchColumnsData();
  }, []);

  const handelColumnNameChange = async (columnName, newName) => {  // changed from handelCommandNameChange
    
    const updatedColumnData = {
      newColumnName: newName,
    }
    console.log(columnName); // changed from hand))
    console.log(updatedColumnData); // changed from hand)
    try {
      await updateHalalColumn(columnName, updatedColumnData);  // changed from updateCommandById
      setColumns((prevColumns) => {  // changed from setCommands
        return prevColumns.map((column) => {  // changed from command
          if (column.columnName === columnName) {
            // Update the columnName for the matching columnId  // changed from commandName
            return { ...column, columnName: newName };  // changed from commandName
          }
          return column;  // changed from command
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

  const handleDeleteColumn = async (columnName) => {  // changed from handleDeleteCommand
    Swal.fire({
      title: `האם את/ה בטוח/ה שתרצה/י למחוק את העמודה ${columnName}`,  // changed from commandName
      text: "פעולה זאת איננה ניתנת לשחזור",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "מחק עמודה",
      cancelButtonText: "בטל",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteHalalColumn(columnName);  // changed from deleteCommandById
          setColumns((prevColumns) => {  // changed from setCommands
            const updatedColumns = prevColumns.filter(
              (column) => column.columnName !== columnName
            );
            return updatedColumns;
          });
          Swal.fire({
            title: `עמודה "${columnName}" נמחק בהצלחה!`,  // changed from commandName
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
          });
        }
      }
    });
  };

  const handelAddColumn = async (value) => {  // changed from handelAddCommand
    // setSearchInputValue("");
    // setOpenDialog(false);
    // if (value !== "") {
    //   try {
    //     const column = await createColumn(value);  // changed from createCommand

    //     setColumns((prev) => [
    //       ...prev,
    //       {
    //         id: column.id,
    //         columnName: column.columnName,  // changed from commandName
    //       },
    //     ]);
    //   } catch (error) {
    //     const errors = error.response.data.body.errors;
    //     let errorsForSwal = ""; // Start unordered list

    //     errors.forEach((error) => {
    //       if (error.message === "columnName must be unique") {  // changed from commandName
    //         errorsForSwal += "<li>הפיקוד כבר קיים במערכת</li>";
    //       }
    //     });

    //     Swal.fire({
    //       title: ` לא ניתן ליצור את הפיקוד ${value}`,  // changed from command
    //       html: `<ul style="direction: rtl; text-align: right">${errorsForSwal}</ul>`, // Render errors as list items
    //       icon: "error",
    //       confirmButtonColor: "#3085d6",
    //       confirmButtonText: "אישור",
    //       reverseButtons: true,
    //       customClass: {
    //         container: "swal-dialog-custom",
    //       },
    //     });
    //   }
    // } else {
    //   Swal.fire({
    //     title: `לא הכנסת ערך בשדה`,
    //     text: "",
    //     icon: "error",
    //     confirmButtonColor: "#3085d6",
    //     confirmButtonText: "בטל",
    //     reverseButtons: true,
    //   });
    // }
  };

  const handelSearchInput = (e) => {
    setSearchInputValue(e.target.value);
  };

  // Filter the list based on the search input
  const filteredColumns = columns.filter((column) => {  // changed from command
    return column.columnName.includes(searchInputValue);  // changed from commandName
  });

  return (
    <div className="columnsContainer">  {/* changed from commandsContainer */}
      <div className="columnsHeader">  {/* changed from commandsHeader */}
        <h1>עמודות שהוספו</h1>
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
      <ul className="columns-list">  {/* changed from commands-list */}
        {filteredColumns.map((column) => (  // changed from command
          <li key={column.columnName}>
            <EditableItem
              isColumn={true}
              itemName={column.columnName}  // changed from commandName
              itemId={column.columnName}
              handleItemNameChange={handelColumnNameChange}  // changed from handelCommandNameChange
              handleDeleteItem={handleDeleteColumn}  // changed from handleDeleteCommand
              isNewItem={column.isNewItem ? true : false}
              columnType={column.columnType}  // changed from commandName
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
          onCreateClicked={handelAddColumn}  // changed from handelAddCommand
          isColumn={true}
        />
      </div>
    </div>
  );
}
