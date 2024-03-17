import React, { useState } from "react";
import { Button, TextField, ThemeProvider, createTheme } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import EditableItem from "../../components/reuseableItem";
import "./ManageGraveyardsPage.css";
import {
  createGraveyard,
  deleteGraveyardById,
  getAllGraveyards,
  updateGraveyardById,
} from "../../utils/api/graveyardsApi";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import SimpleDialog from "../../components/Dialog";
import { useEffect } from "react";

const theme = createTheme({
  direction: "rtl",
});

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function ManageCommandsPage() {
  const [graveyards, setGraveyards] = useState([]);
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
    const fetchGraveyardsData = async () => {
      setLoading(true);
      // Change function name
      try {
        const graveyards = await getAllGraveyards(); // Change function name

        setGraveyards(graveyards); // Change state variable name
        setLoading(false); // Data fetching completed, set loading to false

      } catch (error) {
        console.error("Error during get graveyards:", error); // Change error message
      }
    };

    fetchGraveyardsData();
  }, []);

  if (loading) {
    return <span className="loader"></span>; // Render loading indicator
  }

  const handelGraveyardNameChange = async (graveyardId, newName) => {
    // Change function name
    try {
      await updateGraveyardById(loggedUserId, graveyardId, newName); // Change function name
      setGraveyards((prevGraveyards) => {
        return prevGraveyards.map((graveyard) => {
          if (graveyard.id === graveyardId) {
            // Update the graveyardName for the matching graveyardId
            return { ...graveyard, graveyardName: newName }; // Change property name
          }
          return graveyard;
        });
      });
      Swal.fire({
        title: `בין העלמין "${newName}" עודכן בהצלחה!`,
        text: "",
        icon: "success",
        confirmButtonText: "אישור",
        customClass: {
          container: "swal-dialog-custom",
        },
      }).then((result) => {});
    } catch (error) {
      const errors = error.response.data.body.errors;
      console.log(errors);
      let errorsForSwal = ""; // Start unordered list

      errors.forEach((error) => {
        if (error.message === "graveyardName must be unique") {
          errorsForSwal += `<li>בית העלמין ${newName} כבר קיים במערכת</li>`;
        }
      });

      Swal.fire({
        title: ` לא ניתן לעדכן את שם בית העלמין`,
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

  const handleDeleteGraveyard = async (graveyardId, graveyardName) => {
    Swal.fire({
      title: `האם את/ה בטוח/ה שתרצה/י למחוק את בית העלמין ${graveyardName}`,
      text: "פעולה זאת איננה ניתנת לשחזור",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "מחק בית עלמין",
      cancelButtonText: "בטל",
      reverseButtons: true,
      customClass: {
        container: "swal-dialog-custom",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteGraveyardById(loggedUserId, graveyardId);
          setGraveyards((prevGraveyards) => {
            const updatedGraveyards = prevGraveyards.filter(
              (graveyard) => graveyard.id !== graveyardId
            );
            return updatedGraveyards;
          });
          Swal.fire({
            title: `בית עלמין "${graveyardName}" נמחק בהצלחה!`,
            text: "",
            icon: "success",
            confirmButtonText: "אישור",
            customClass: {
              container: "swal-dialog-custom",
            },
          });
        } catch (error) {
          Swal.fire({
            title: `לא ניתן למחוק את בית העלמין ${graveyardName}`,
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

  const handelAddGraveyard = async (value) => {
    // setSearchInputValue("");
    if (value !== "") {
      try {
        const graveyard = await createGraveyard(loggedUserId, value);

        setGraveyards((prev) => [
          ...prev,
          {
            id: graveyard.id,
            graveyardName: graveyard.graveyardName?.trim(),
          },
        ]);
        Swal.fire({
          title: `בית העלמין "${graveyard.graveyardName}" נוצר בהצלחה!`,
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
        console.log(errors);
        let errorsForSwal = ""; // Start unordered list

        errors.forEach((error) => {
          if (error.message === "graveyardName must be unique") {
            errorsForSwal += "<li>בית העלמין כבר קיים במערכת</li>";
          }
        });


        Swal.fire({
          title: ` לא ניתן ליצור את בית העלמין ${value}`,
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
  const filteredGraveyards = graveyards.filter((graveyard) => {
    return graveyard.graveyardName.includes(searchInputValue);
  });

  // Sort the filtered list alphabetically
  filteredGraveyards.sort((a, b) => {
    return a.graveyardName.localeCompare(b.graveyardName, undefined, {
      sensitivity: "base",
    });
  });

  return (
    <div className="graveyardContainer">
      <div className="graveyardHeader">
        <h1>רשימת בתי עלמין</h1>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <div style={{ direction: "rtl", display: "flex" }}>
              <TextField
                id="filled-search"
                label="חפש בית עלמין"
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
      <ul className="graveyard-list">
        {filteredGraveyards.map((graveyard) => (
          <li key={graveyard.id}>
            <EditableItem
              itemName={graveyard.graveyardName}
              itemId={graveyard.id}
              handleItemNameChange={handelGraveyardNameChange}
              handleDeleteItem={handleDeleteGraveyard}
              isNewItem={graveyard.isNewItem ? true : false}
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
          onCreateClicked={handelAddGraveyard}
          isGraveyard={true}
        />
      </div>
    </div>
  );
}
