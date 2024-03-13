export const filterColumns = (columns, searchInputValue, originalColumns) => {
  const filteredColumnsBySearchInput = columns.filter((column) => {
    return column.columnName?.includes(searchInputValue);
  });
  const matchingColumns = filteredColumnsBySearchInput.filter((column) =>
    originalColumns.some((originColumn) => originColumn === column.columnName)
  );
  const nonMatchingColumns = filteredColumnsBySearchInput.filter(
    (column) =>
      !originalColumns.some(
        (originColumn) => originColumn === column.columnName
      )
  );
  matchingColumns.sort(
    (a, b) =>
      originalColumns.indexOf(a.columnName) -
      originalColumns.indexOf(b.columnName)
  );

  // Combine the matching and non-matching columns
  return [...nonMatchingColumns, ...matchingColumns];
};

export const removeQuotes = (inputString) => {
  // Remove the overall quotes from the input string
  inputString = inputString.replace(/^{|"|}$/g, "");

  // Split the input string by commas and remove leading/trailing whitespaces
  const items = inputString.split(",").map((item) => item.trim());

  // Remove double quotes from the first and last character of each item if they are present
  const itemsWithoutQuotes = items.map((item) => {
    if (item.startsWith('"') && item.endsWith('"')) {
      return item.slice(1, -1); // Remove quotes from the beginning and end
    }
    return item;
  });

  // Join the items back into a string and return
  return `{${itemsWithoutQuotes.join(",")}}`;
};

export const handleDefaultValue = (defaultValue, columnType) => {
  let result = defaultValue;
  if (
    defaultValue === null ||
    (typeof defaultValue === "string" &&
      columnType !== "BOOLEAN" &&
      defaultValue.includes("NULL"))
  ) {
    return "לא הוגדר ערך ברירת מחדל";
    // result = null;
  } else if (columnType === "BOOLEAN") {
    return defaultValue;
  } else if (defaultValue.includes("enum_nifgaimHalals_")) {
    const startIndex = defaultValue.indexOf("'") + 1; // Find the index of the first single quote
    const endIndex = defaultValue.lastIndexOf("'"); // Find the index of the last single quote
    return defaultValue.substring(startIndex, endIndex); // Extract the substring between the first and last single quotes
  } else if (defaultValue.includes("timestamp with time zone")) {
    const timestampString = defaultValue.split("'")[1];

    // Parse the timestamp string and format it
    const timestamp = new Date(timestampString);

    const day = timestamp.getDate();
    const month = timestamp.getMonth() + 1; // Months are zero-based, so add 1
    const year = timestamp.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  } else if (columnType === "BOOLEAN") {
    return defaultValue;
  } else if (defaultValue.includes("enum_nifgaimHalals_")) {
    const startIndex = defaultValue.indexOf("'") + 1; // Find the index of the first single quote
    const endIndex = defaultValue.lastIndexOf("'"); // Find the index of the last single quote
    return defaultValue.substring(startIndex, endIndex); // Extract the substring between the first and last single quotes
  } else {
    if (defaultValue instanceof Date) {
      console.log("here is a default value");
      // const day = String(defaultValue.getDate()).padStart(2, "0");
      // const month = String(defaultValue.getMonth() + 1).padStart(2, "0"); // Month is zero-based
      // const year = defaultValue.getFullYear();
      // result = `${day}/${month}/${year}`;
    } else if (
      defaultValue.includes("timestamp with time zone") ||
      defaultValue.includes("character varying")
    ) {
      const temp = defaultValue.match(/'([^']+)'/)[1];
      result = temp.substring(0, 10);
      // result = `${day}/${month}/${year}`;
    }
  }
  return result;
};

export const handleDataTypeName = (dataType) => {
  switch (dataType) {
    case "character varying":
      return "STRING";
    case "timestamp with time zone":
      return "DATE";
    case "boolean":
      return "BOOLEAN";
    case "USER-DEFINED":
      return "ENUM";
    case "integer":
      return "INTEGER";
    case "uuid":
      return "UUID";

    default:
      break;
  }
};
