import React from "react";
import { Button, IconButton } from "@mui/material";
import "../../pages/HalalimPage/HalalimPage.css";
import AddIcon from "@mui/icons-material/Add";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import CreateHalalDialog from "../../pages/HalalimPage/CreateHalalDialog";
import { useState } from "react";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import MagicButtonDialog from "../../pages/HalalimPage/MagicButtonDialog";

export default function HalalimCustomToolBar({
  setRows,
  rows,
  columns,
  allDataOfHalalsColumns,
  originalColumns,
  commands,
  graveyards,
  editPerm,
  managePerm,
  enums,
}) {
  const [openCreateNewHalal, setOpenCreateNewHalal] = useState(false);
  const [openMagicDialog, setOpenMagicDialog] = useState(false);

  const handleCreateNewHalal = () => {
    setOpenCreateNewHalal(true);
  };

  const handleMagicClick = () => {
    setOpenMagicDialog(true);
  };

  const handleExportToExcel = () => {
    const data = rows.map((row) =>
      columns.map((col) => {
        const value = row[col.field];
        if (typeof value === "boolean") {
          return value ? "כן" : "לא";
        }
        return value;
      })
    );

    const ws = XLSX.utils.aoa_to_sheet([
      columns.map((col) => col.headerName),
      ...data,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "נפגעים - חללים.xlsx"
    );
  };

  return (
    <>
      {(editPerm || managePerm) && (
        <Button
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateNewHalal}
          sx={{
            paddingRight: "80px",
            borderRadius: "5000px 5000px 0 0",

            "& .MuiButton-startIcon": {
              marginLeft: "-115px",
            },
            "&:hover": {
              backgroundColor: "#EDF3F8",
            },
          }}
        >
          הוסף חלל חדש
        </Button>
      )}
      {openCreateNewHalal && (
        <CreateHalalDialog
          openDialog={openCreateNewHalal}
          setOpenDialog={setOpenCreateNewHalal}
          allDataOfHalalsColumns={allDataOfHalalsColumns}
          // originalColumns={originalColumns}
          setRows={setRows}
          rows={rows}
          commands={commands}
          graveyards={graveyards}
          enums={enums}
        />
      )}

      {openMagicDialog && (
        <MagicButtonDialog
          open={openMagicDialog} // Open dialog only if both conditions are true
          setOpenDialog={setOpenMagicDialog}
          allDataOfHalalsColumns={allDataOfHalalsColumns}
          originalColumns={originalColumns}
          setRows={setRows}
        />
      )}

      <GridToolbarContainer
        style={{
          direction: "rtl",
          marginTop: "0.5vh",
          marginRight: "0.5vw",
          justifyContent: "space-between",
          marginBottom: editPerm || managePerm ? 0 : "1.2vh",
        }}
      >
        <div>
          <IconButton onClick={() => handleMagicClick()}>
            <AutoFixHighIcon />
          </IconButton>
          <GridToolbarColumnsButton
            color="secondary"
            sx={{
              "& .MuiButton-startIcon": {
                marginLeft: "2px",
              },
            }}
          />
          <GridToolbarFilterButton
            color="secondary"
            sx={{
              "& .MuiButton-startIcon": {
                marginLeft: "2px",
              },
            }}
          />
          <GridToolbarDensitySelector
            color="secondary"
            sx={{
              "& .MuiButton-startIcon": {
                marginLeft: "2px",
              },
            }}
          />
          <Button
            color="secondary"
            startIcon={<SaveAltIcon />}
            onClick={handleExportToExcel}
            sx={{
              fontSize: "small",
              "& .MuiButton-startIcon": {
                marginLeft: "2px",
              },
              "&:hover": {
                backgroundColor: "#EDF3F8",
              },
            }}
          >
            ייצוא לאקסל
          </Button>
        </div>
        <div>
          <GridToolbarQuickFilter
            placeholder="חיפוש"
            style={{
              marginRight: "1rem",
            }}
            sx={{
              "& .MuiInputBase-root": {
                width: "87%",
                height: "28px",
                direction: "rtl",
              },
              "& .MuiSvgIcon-root": {
                display: "none",
              },
            }}
          />
        </div>
      </GridToolbarContainer>
    </>
  );
}
