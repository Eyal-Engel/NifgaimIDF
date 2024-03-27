import React from "react";
import { Input } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import "../ReuseableItem.css";
import RtlPlugin from "../rtlPlugin/RtlPlugin";

const StringTypeItem = ({
  isInEditMode,
  defaultValue,
  editedDefaultValue,
  handleInputDefaultValueChange,
}) => {
  return (
    <RtlPlugin>
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
          value="STRING"
          label="סוג"
          disabled
        >
          <MenuItem dir="rtl" value="STRING" selected={true}>
            טקסט
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
            value={defaultValue}
            disabled
            sx={{ textAlign: "left" }}
          >
            <MenuItem
              dir="rtl"
              value={defaultValue}
              selected={defaultValue !== null}
            >
              {defaultValue}
            </MenuItem>
          </Select>
        ) : (
          <Input
            type="text"
            value={
              editedDefaultValue === "לא הוגדר ערך ברירת מחדל"
                ? ""
                : editedDefaultValue
            }
            onChange={handleInputDefaultValueChange}
            style={{
              // width: "30%",
              fontSize: "1.2rem",
              padding: "8px",
              margin: "10px",
              direction: "rtl",
            }}
            inputProps={{ maxLength: "500" }}
          />
        )}
      </FormControl>
    </RtlPlugin>
  );
};

export default StringTypeItem;
