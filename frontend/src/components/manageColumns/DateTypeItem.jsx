import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import "../ReuseableItem.css";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import RtlPlugin from "../rtlPlugin/RtlPlugin";

const DateTypeItem = ({
  isInEditMode,
  editedDefaultValue,
  handleInputDefaultValueChange,
}) => {
  return (
    <RtlPlugin
      style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
    >
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
          value="DATE"
          label="סוג"
          disabled
        >
          <MenuItem dir="rtl" value="DATE" selected={true}>
            תאריך
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
          <DatePicker
            format="D/M/YYYY"
            value={dayjs(editedDefaultValue, "D/M/YYYY")}
            onChange={handleInputDefaultValueChange}
          />
        )}
      </FormControl>
    </RtlPlugin>
  );
};
export default React.memo(DateTypeItem);
