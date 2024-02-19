import React, { useState } from "react";
import "./ManageGraveyardsPage.css";
import { TextField, ThemeProvider, createTheme } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import EditableItem from "../../components/reuseableItem";

const theme = createTheme({
  direction: "rtl",
});

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function ManageGraveyardsPage() {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [listOfGraveyards, setListOfGraveyards] = useState([
    "בית העלמין הצבאי חולון",
    "בית העלמין הצבאי ראשון",
    "בית העלמין הצבאי תל אביב",
    "בית העלמין הצבאי בת ים",
    "בית העלמין הצבאי רחובות",
    "בית העלמין הצבאי ראש העין",
    "בית העלמין הצבאי נהריה",
    "בית העלמין הצבאי חיפה",
    "בית העלמין הצבאי ירושלים",
    "בית העלמין הצבאי באר שבע",
    "בית העלמין הצבאי באר יעקב",
  ]);

  const handelGraveyardNameChange = (graveyardIndex, newName) => {
    setListOfGraveyards((prevGraveyards) => {
      const updatedGraveyards = [...prevGraveyards];
      updatedGraveyards[graveyardIndex] = newName;
      return updatedGraveyards;
    });
  };

  const handleDeleteGraveyard = (graveyardIndex) => {
    setListOfGraveyards((prevGraveyards) => {
      const updatedGraveyards = [...prevGraveyards];
      updatedGraveyards.splice(graveyardIndex, 1);
      return updatedGraveyards;
    });
  };

  const handelSearchInput = (e) => {
    setSearchInputValue(e.target.value);
  };

  // Filter the list based on the search input
  const filteredGraveyards = listOfGraveyards.filter((graveyard) =>
    graveyard.includes(searchInputValue)
  );

  return (
    <div className="graveyardContainer">
      <div className="graveyardHeader">
        <h1>רשימת בתי העלמין</h1>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <div style={{ direction: "rtl", display: "flex" }}>
              <TextField
                id="filled-search"
                label="חפש בית עלמין"
                type="search"
                variant="filled"
                onChange={handelSearchInput}
                sx={{ zIndex: 0 }}
              />
            </div>
          </ThemeProvider>
        </CacheProvider>
      </div>
      <ul className="graveyard-list">
        {filteredGraveyards.map((graveyard, index) => (
          <li key={index}>
            <EditableItem
              itemName={graveyard}
              handleItemNameChange={handelGraveyardNameChange}
              itemIndex={index}
              handleDeleteItem={handleDeleteGraveyard}
              isGraveyard
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
