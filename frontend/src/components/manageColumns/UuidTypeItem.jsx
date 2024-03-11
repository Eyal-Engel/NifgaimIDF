import React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { Input } from "@mui/material";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { ThemeProvider, createTheme } from "@mui/material";
import "../reuseableItem.css";

const theme = (outerTheme) =>
  createTheme({
    direction: "rtl",
    palette: {
      mode: outerTheme.palette.mode,
    },
  });

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const UuidTypeItem = ({
  isInEditMode,
  itemName,
  editedItemName,
  handleInputChange,
  columnType,
}) => {
  return (
    <>
      {!isInEditMode ? (
        <Typography
          sx={{
            textAlign: "end",
            padding: "10px",
          }}
          variant="h6"
          component="div"
        >
          {itemName}
        </Typography>
      ) : (
        <Input
          type="text"
          value={editedItemName}
          onChange={handleInputChange}
          autoFocus
          sx={{
            fontSize: "1.2rem",
            padding: "0px 8px",
            margin: "10px",
            direction: "rtl",
          }}
        />
      )}

      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <FormControl
            className="selectTypeOfColumn"
            sx={{
              m: 1,
              // width: "15%",
              zIndex: 0,
            }}
            size="small"
          >
            <InputLabel id="columnType">סוג</InputLabel>
            <Select
              dir="rtl"
              labelId="columnType"
              id="columnType"
              value={columnType}
              label="סוג"
              disabled
            >
              <MenuItem dir="rtl" value="UUID" selected={columnType === "UUID"}>
                מספר יחודי
              </MenuItem>
            </Select>
          </FormControl>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
};

export default UuidTypeItem;
