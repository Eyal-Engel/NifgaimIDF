import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import "../ReuseableItem.css";
import RtlPlugin from "../rtlPlugin/RtlPlugin";

const UuidTypeItem = React.memo(({ columnType }) => {
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
          value={columnType}
          label="סוג"
          disabled
        >
          <MenuItem dir="rtl" value="UUID" selected={columnType === "UUID"}>
            מספר יחודי
          </MenuItem>
        </Select>
      </FormControl>
    </RtlPlugin>
  );
});

export default UuidTypeItem;
