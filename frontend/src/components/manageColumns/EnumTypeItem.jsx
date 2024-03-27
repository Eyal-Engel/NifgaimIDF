import React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { Chip } from "@mui/material";
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

const EnumTypeItem = ({
  columnType,
  editedDefaultValue,
  enumValuesFromColumn,
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
                value={columnType}
                selected={columnType.includes("select")}
              >
                בחירה
              </MenuItem>
              <MenuItem dir="rtl" value="ENUM" selected={columnType === "ENUM"}>
                בחירה
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl
            className="selectDefaultValueOfColumn"
            sx={{
              m: 1,
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
          </FormControl>

          <FormControl
            className="selectEnums"
            sx={{
              m: 1,
              zIndex: 0,
            }}
            size="small"
          >
            <Select
              labelId="defaultValue"
              id="defaultValue-select"
              multiple
              disabled
              value={enumValuesFromColumn}
              renderValue={(selected) => (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} style={{ margin: 2 }} />
                  ))}
                </div>
              )}
              sx={{
                background: "white",
                paddingRight: "5px",
                paddingLeft: "5px",
                marginTop: "0px",
                fontSize: "15px",
              }}
            ></Select>
          </FormControl>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
};

export default EnumTypeItem;
