import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import ReuseableItem from "../../components/ReuseableItem";
import "./ManageCommandsPage.css";
import {
  createCommand,
  deleteCommandById,
  getCommands,
  updateCommandById,
} from "../../utils/api/commandsApi";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import ReusableCreateItemDialog from "../../components/ReusableCreateItemDialog";
import { useEffect } from "react";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";

export default function ManageCommandsPage() {
  const [commands, setCommands] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";
  const [loading, setLoading] = useState(true); // State for loading indicator

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handelOpenDialog = () => {
    setOpenDialog(true);
  };
  useEffect(() => {
    const fetchCommandsData = async () => {
      setLoading(true);
      try {
        const commands = await getCommands();
        console.log(commands);
        setCommands(commands);
        setLoading(false); // Data fetching completed, set loading to false
      } catch (error) {
        console.error("Error during get commands:", error);
      }
    };

    fetchCommandsData();
  }, []);

  const handelCommandNameChange = async (commandId, newName) => {
    try {
      await updateCommandById(loggedUserId, commandId, newName);
      setCommands((prevCommands) => {
        return prevCommands.map((command) => {
          if (command.id === commandId) {
            // Update the commandName for the matching commandId
            return { ...command, commandName: newName };
          }
          return command;
        });
      });
      Swal.fire({
        title: `פיקוד "${newName}" עודכן בהצלחה!`,
        text: "",
        icon: "success",
        confirmButtonText: "אישור",
        customClass: {
          container: "swal-dialog-custom",
        },
      }).then((result) => {});
    } catch (error) {
      const errors = error.response.data.body.errors;
      let errorsForSwal = ""; // Start unordered list

      errors.forEach((error) => {
        if (error.message === "commandName must be unique") {
          errorsForSwal += `<li>הפיקוד ${newName} כבר קיים במערכת</li>`;
        }
      });

      Swal.fire({
        title: ` לא ניתן לעדכן את הפיקוד`,
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
      customClass: {
        container: "swal-dialog-custom",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCommandById(loggedUserId, commandId);
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
            customClass: {
              container: "swal-dialog-custom",
            },
          });
        } catch (error) {
          const errors = error.response.data.body?.errors;
          let errorsForSwal = ""; // Start unordered list

          if (errors) {
            errors.forEach((error) => {
              if (
                error.message ===
                "Cannot delete command with associated NifgaimHalal"
              ) {
                errorsForSwal += "<li>יש חלל שמשוייך לפיקוד זה</li>";
              }
              if (
                error.message ===
                "Cannot delete command with associated NifgaimUser"
              ) {
                errorsForSwal += "<li>יש משתמש שמשוייך לפיקוד זה</li>";
              }
            });
          } else {
            errorsForSwal += `<li>${error}</li>`;
          }

          Swal.fire({
            title: ` לא ניתן למחוק את הפיקוד ${commandName}`, // changed from command
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
      }
    });
  };

  const handelAddCommand = async (value) => {
    // setSearchInputValue("");
    if (value !== "") {
      try {
        const command = await createCommand(loggedUserId, value);
        setCommands((prev) => [
          {
            id: command.newCommand.id,
            commandName: command.newCommand.commandName?.trim(),
            isNewSource: true,
          },
          ...prev,
        ]);
        Swal.fire({
          title: `פיקוד "${command.newCommand.commandName}" נוצר בהצלחה!`,
          text: "",
          icon: "success",
          confirmButtonText: "אישור",
          customClass: {
            container: "swal-dialog-custom",
          },
        }).then(() => {
          setOpenDialog(false);
        });
      } catch (error) {
        const errors = error.response.data.body.errors;
        let errorsForSwal = ""; // Start unordered list

        errors?.forEach((error) => {
          if (error.message === "commandName must be unique") {
            errorsForSwal += "<li>הפיקוד כבר קיים במערכת</li>";
          }
        });

        Swal.fire({
          title: ` לא ניתן ליצור את הפיקוד ${value}`,
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
        title: `לא הכנסת ערך בשדה`,
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
  const filteredCommands = commands.filter((command) => {
    return command.commandName.includes(searchInputValue);
  });

  if (loading) {
    return <span className="loader"></span>; // Render loading indicator
  }

  return (
    <div className="commandsContainer">
      <div className="commandsHeader">
        <h1>רשימת פיקודים</h1>
        <RtlPlugin>
          <TextField
            id="filled-search"
            label="חפש פיקוד"
            type="search"
            variant="filled"
            value={searchInputValue}
            onChange={handelSearchInput}
            sx={{ zIndex: 0 }}
          />
        </RtlPlugin>
      </div>
      <ul className="commands-list">
        {filteredCommands.map((command) => (
          <li key={command.id}>
            <ReuseableItem
              itemName={command.commandName}
              itemId={command.id}
              handleItemNameChange={handelCommandNameChange}
              handleDeleteItem={handleDeleteCommand}
              isNewItem={command.isNewSource}
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
          onCreateClicked={handelAddCommand}
        />
      </div>
    </div>
  );
}
