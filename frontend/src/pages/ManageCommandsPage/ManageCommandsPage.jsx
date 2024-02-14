import React, { useState } from "react";
import { TextField, ThemeProvider, createTheme } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import EditableItem from "../../components/reuseableItem";
import "./ManageCommandsPage.css";

const theme = createTheme({
  direction: "rtl",
});

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function ManageCommandsPage() {
  const [listOfCommands, setListOfCommands] = useState([
    "צפון",
    "דרום",
    "מרכז",
    "מזרח",
    "ירושלים",
    "סגל",
    "פיקוד העורף",
  ]);

  const [searchInputValue, setSearchInputValue] = useState("");

  const handelCommandNameChange = (commandIndex, newName) => {
    setListOfCommands((prevCommands) => {
      const updatedCommands = [...prevCommands];
      updatedCommands[commandIndex] = newName;
      return updatedCommands;
    });
  };

  const handleDeleteCommand = (commandIndex) => {
    setListOfCommands((prevCommands) => {
      const updatedCommands = [...prevCommands];
      updatedCommands.splice(commandIndex, 1);
      return updatedCommands;
    });
  };

  const handelSearchInput = (e) => {
    setSearchInputValue(e.target.value);
  };

  // Filter the list based on the search input
  const filteredCommands = listOfCommands.filter((command) =>
    command.includes(searchInputValue)
  );

  return (
    <div className="commandsContainer">
      <h1>רשימת פיקודים</h1>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <div style={{ direction: "rtl", display: "flex" }}>
            <TextField
              id="filled-search"
              label="חפש פיקוד"
              type="search"
              variant="filled"
              onChange={handelSearchInput}
              sx={{zIndex: 0}}
            />
          </div>
        </ThemeProvider>
      </CacheProvider>
      <ul className="commands-list">
        {filteredCommands.map((command, index) => (
          <li key={index}>
            <EditableItem
              itemName={command}
              handleItemNameChange={handelCommandNameChange}
              itemIndex={index}
              handleDeleteItem={handleDeleteCommand}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
