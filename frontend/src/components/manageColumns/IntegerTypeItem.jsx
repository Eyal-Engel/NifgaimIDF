import React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { Input } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { ThemeProvider, createTheme } from "@mui/material";
import "../ReuseableItem.css";

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

const IntegerTypeItem = ({
  isInEditMode,
  columnType,
  editedDefaultValue,
  handleInputDefaultValueChange,
}) => {
  return (
    <>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <FormControl
            className="selectTypeOfColumn"
            sx={{
              m: 1,
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
              <MenuItem
                dir="rtl"
                value="INTEGER"
                selected={columnType === "INTEGER"}
              >
                מספר
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl
            className="selectDefaultValueOfColumn"
            sx={{
              m: 1,
              // width: "20%",
              minWidth: "7rem",
              zIndex: 0,
            }}
            size="small"
          >
            <InputLabel
              id="defaultValue"
              sx={{
                background: "white",
                paddingRight: "5px",
                paddingLeft: "5px",
                marginTop: "0px",
                fontSize: "15px",
              }}
            >
              ערך ברירת מחדל
            </InputLabel>
            {!isInEditMode ? (
              <Select
                dir="rtl"
                value={editedDefaultValue}
                disabled
                sx={{ textAlign: "left" }}
              >
                <MenuItem
                  dir="rtl"
                  value={editedDefaultValue}
                  selected={editedDefaultValue !== null}
                >
                  {editedDefaultValue}
                </MenuItem>
              </Select>
            ) : (
              <Input
                type="number"
                color="primary"
                value={editedDefaultValue}
                onChange={handleInputDefaultValueChange}
                style={{
                  // width: "30%",
                  fontSize: "1.2rem",
                  padding: "8px",
                  margin: "10px",
                  direction: "rtl",
                }}
                inputProps={{ maxlength: "500" }}
              />
            )}
          </FormControl>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
};

export default IntegerTypeItem;
