import React, { useState } from "react";
import { Button, TextField, ThemeProvider, createTheme } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import EditableItem from "../../components/reuseableItem";
import "./ManageCommandsPage.css";
import {
  createCommand,
  deleteCommandById,
  getCommands,
  updateCommandById,
} from "../../utils/api/commandsApi";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import SimpleDialogDemo from "../../components/Dialog";
import SimpleDialog from "../../components/Dialog";

const theme = createTheme({
  direction: "rtl",
});

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function ManageCommandsPage() {
  const [commands, setCommands] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handelOpenDialog = () => {
    setOpenDialog(true);
  };
  React.useEffect(() => {
    const fetchCommandsData = async () => {
      try {
        const commands = await getCommands();

        console.log(commands);
        setCommands(commands);
      } catch (error) {
        console.error("Error during get commands:", error);
      }
    };

    fetchCommandsData();
  }, []);

  function getCommandNameById(id) {
    const item = commands.find((item) => item.id === id);
    return item ? item.commandName : null;
  }

  const handelCommandNameChange = async (commandId, newName) => {
    try {
      await updateCommandById(commandId, newName);
      setCommands((prevCommands) => {
        return prevCommands.map((command) => {
          if (command.id === commandId) {
            // Update the commandName for the matching commandId
            return { ...command, commandName: newName };
          }
          return command;
        });
      });
    } catch (error) {
      const name = getCommandNameById(commandId);
      Swal.fire({
        title: ` ${newName} עם השם ${name} לא ניתן לעדכן את הפיקוד`,
        text: error,
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "אישור",
        reverseButtons: true,
      });
    }
  };

  const handleDeleteCommand = async (commandId, commandName) => {
    Swal.fire({
      title: `האם את/ה בטוח/ה שתרצה/י למחוק את הפיקוד ${commandName}`,
      text: "פעולה זאת איננה ניתנת לשחזור",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "מחק פיקוד",
      cancelButtonText: "בטל",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log(commandId);
          await deleteCommandById(commandId);
          setCommands((prevCommands) => {
            const updatedCommands = prevCommands.filter(
              (command) => command.id !== commandId
            );
            return updatedCommands;
          });
          Swal.fire({
            title: `פיקוד "${commandName}" נמחק בהצלחה!`,
            text: "",
            icon: "success",
            confirmButtonText: "אישור",
          });
        } catch (error) {
          Swal.fire({
            title: `לא ניתן למחוק את הפיקוד`,
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

  const handelAddCommand = async (value) => {
    setSearchInputValue("");
    setOpenDialog(false);

    try {
      const command = await createCommand(value);
      console.log(command);

      setCommands((prev) => [
        ...prev,
        {
          id: command.id,
          commandName: command.commandName,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const handelSearchInput = (e) => {
    setSearchInputValue(e.target.value);
  };

  // Filter the list based on the search input
  const filteredCommands = commands.filter((command) => {
    return command.commandName.includes(searchInputValue);
  });

  return (
    <div className="commandsContainer">
      <div className="commandsHeader">
        <h1>רשימת פיקודים</h1>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <div style={{ direction: "rtl", display: "flex" }}>
              <TextField
                id="filled-search"
                label="חפש פיקוד"
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
      <ul className="commands-list">
        {filteredCommands.map((command) => (
          <li key={command.id}>
            <EditableItem
              itemName={command.commandName}
              itemId={command.id}
              handleItemNameChange={handelCommandNameChange}
              handleDeleteItem={handleDeleteCommand}
              isNewItem={command.isNewItem ? true : false}
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
          onCreateClicked={handelAddCommand}
        />
      </div>
    </div>
  );
}
