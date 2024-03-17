import React from "react";

import AddIcon from "@mui/icons-material/Add";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { Button } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import CreateLeftOverDialog from "../../pages/ManageLeftOversPage/CreateLeftOverDialog";

export default function CustomToolBarLeftOver({
  rows,
  setRows,
  columns,
  editPerm,
  managePerm,
}) {
  const [openCreateNewLeftOver, setOpenCreateNewLeftOver] =
    React.useState(false);

  const handleCreateNewLeftOver = () => {
    setOpenCreateNewLeftOver(true);
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
      "נפגעים - שארים.xlsx"
    );
  };

  return (
    <>
      {(editPerm || managePerm) && (
        <Button
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateNewLeftOver}
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
          הוסף שאר חדש
        </Button>
      )}

      {openCreateNewLeftOver && (
        <CreateLeftOverDialog
          openDialog={openCreateNewLeftOver}
          setOpenDialog={setOpenCreateNewLeftOver}
          rows={rows}
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
          {/* <GridToolbarExport
            color="secondary"
            sx={{
              "& .MuiButton-startIcon": {
                marginLeft: "2px",
              },
            }}
          /> */}
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
