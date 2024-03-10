import React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { FormControlLabel, Input, Radio, RadioGroup } from "@mui/material";
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

const BooleanTypeItem = ({
  isInEditMode,
  itemName,
  editedItemName,
  handleInputChange,
  columnType,
  editedDefaultValue,
  handleInputDefaultValueChange,
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
              <MenuItem
                dir="rtl"
                value="BOOLEAN"
                selected={columnType === "BOOLEAN"}
              >
                כן/לא
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
              <>
                {columnType === "BOOLEAN" && (
                  <FormControl
                    sx={{
                      // width: "90%",
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    <RadioGroup
                      aria-labelledby="booleanSelect"
                      name="controlled-radio-buttons-group"
                      value={editedDefaultValue} // Convert boolean to string
                      onChange={handleInputDefaultValueChange}
                      row
                    >
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label="כן"
                      />
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label="לא"
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              </>
            )}
          </FormControl>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
};

export default BooleanTypeItem;
