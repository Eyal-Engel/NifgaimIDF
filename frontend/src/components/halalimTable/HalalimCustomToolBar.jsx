import React from "react";
import { Button } from "@mui/material";
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

export default function HalalimCustomToolBar({
  setRows,
  rows,
  columns,
  allDataOfHalalsColumns,
  originalColumns,
  commands,
  graveyards,
}) {
  const [openCreateNewHalal, setOpenCreateNewHalal] = React.useState(false);

  const handleCreateNewHalal = () => {
    setOpenCreateNewHalal(true);
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
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleCreateNewHalal}
        sx={{
          // paddingRight: "80px",
          borderRadius: "5000px 5000px 0 0",

          "& .MuiButton-startIcon": {
            // marginLeft: "-115px",
          },
          "&:hover": {
            backgroundColor: "#EDF3F8",
          },
        }}
      >
        הוסף חלל חדש
      </Button>

      {openCreateNewHalal && (
        <CreateHalalDialog
          openDialog={openCreateNewHalal}
          setOpenDialog={setOpenCreateNewHalal}
          allDataOfHalalsColumns={allDataOfHalalsColumns}
          originalColumns={originalColumns}
          setRows={setRows}
          rows={rows}
          commands={commands}
          graveyards={graveyards}
          // Add any other necessary props
        />
      )}

      <GridToolbarContainer
        style={{
          direction: "rtl",
          marginTop: "0.5vh",
          marginRight: "0.5vw",
          justifyContent: "space-between",
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
