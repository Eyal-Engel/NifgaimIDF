import { get, post, patch, del } from "./api";

export async function getHalalColumnsAndTypes() {
  const apiUrl = "http://localhost:5000/api/halals/columns/names/";

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "GET",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  try {
    const response = await get(apiUrl, headers);
    return response.data;
  } catch (error) {
    console.log("Error fetching halal columns and types:", error);
    throw error;
  }
}

export async function getHalals() {
  const apiUrl = "http://localhost:5000/api/halals/";

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "GET",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  try {
    const response = await get(apiUrl, headers);
    return response.data;
  } catch (error) {
    console.error("Error fetching halals:", error);
    throw error;
  }
}

export async function getOriginalColumns() {
  const apiUrl = "http://localhost:5000/api/halals/originalColumns";

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "GET",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  try {
    const response = await get(apiUrl, headers);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getHalalById(halalId) {
  const apiUrl = `http://localhost:5000/api/halals/${halalId}`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "GET",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  try {
    const response = await get(apiUrl, headers);
    return response.data;
  } catch (error) {
    console.error(`Error fetching halal with id ${halalId}:`, error);
    throw error;
  }
}

export async function getHalalsByCommandId(commandId) {
  const apiUrl = `http://localhost:5000/api/halals/command/${commandId}`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "GET",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  try {
    const response = await get(apiUrl, headers);
    return response.data;
  } catch (error) {
    console.error(`Error fetching halals for command id ${commandId}:`, error);
    throw error;
  }
}

export async function getColumnEnums(columnName) {
  const apiUrl = `http://localhost:5000/api/halals/columnEnums`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "GET",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  try {
    const response = await get(apiUrl, { params: { columnName }, headers });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching enum values for column '${columnName}':`,
      error
    );
    throw error;
  }
}

export async function createHalal(halalData) {
  const apiUrl = "http://localhost:5000/api/halals/";

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "POST",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  try {
    const response = await post(apiUrl, JSON.stringify(halalData), headers);
    return response.data;
  } catch (error) {
    console.error("Error creating halal:", error);
    throw error;
  }
}

export async function updateHalal(halalId, updatedHalalData) {
  const apiUrl = `http://localhost:5000/api/halals/${halalId}`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "PATCH",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  try {
    const response = await patch(
      apiUrl,
      JSON.stringify(updatedHalalData),
      headers
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating halal with id ${halalId}:`, error);
    throw error;
  }
}

export async function deleteHalal(halalId) {
  const apiUrl = `http://localhost:5000/api/halals/${halalId}`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "DELETE",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  try {
    const response = await del(apiUrl, headers);
    return response.data;
  } catch (error) {
    console.error(`Error deleting halal with id ${halalId}:`, error);
    throw error;
  }
}

export async function addHalalColumn(
  userId,
  columnName,
  dataType,
  defaultValue
) {
  // const commandUserId = getCommandNameByUserId(userId);

  // if (commandUserId === "חיל הלוגיסטיקה") {
  const apiUrl = "http://localhost:5000/api/halals/columns/add";

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "POST",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  const body = JSON.stringify({ userId, columnName, dataType, defaultValue });

  try {
    const response = await post(apiUrl, body, headers);
    return response.data;
  } catch (error) {
    console.error("Error adding halal column:", error);
    throw error;
  }
  // } else {
  //   const error = { body: { errors: [{ message: "User is not authorized" }] } };
  //   throw error;
  // }
}

export async function updateHalalColumn(
  userId,
  columnName,
  newColumnName,
  columnDefault
) {
  console.log("no way bro");
  // const commandUserId = getCommandNameByUserId(userId);

  // if (commandUserId === "חיל הלוגיסטיקה") {
  const apiUrl = `http://localhost:5000/api/halals/columns/update`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "PATCH",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  const body = JSON.stringify({
    userId,
    columnName,
    newColumnName,
    columnDefault,
  });

  console.log(body);

  try {
    const response = await patch(apiUrl, body, headers);
    return response.data;
  } catch (error) {
    console.error(`Error updating halal column '${columnName}':`, error);
    throw error;
  }
  // } else {
  //   const error = { body: { errors: [{ message: "User is not authorized" }] } };
  //   throw error;
  // }
}

export async function updateHalalSelectColumn(
  userId,
  columnName,
  updatedColumnData
) {
  // const commandUserId = getCommandNameByUserId(userId);

  // if (commandUserId === "חיל הלוגיסטיקה") {
  const apiUrl = `http://localhost:5000/api/halals/columns/update`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "PATCH",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  const body = JSON.stringify({ userId, updatedColumnData, columnName });

  try {
    const response = await patch(apiUrl, body, headers);
    return response.data;
  } catch (error) {
    console.error(`Error updating halal column '${columnName}':`, error);
    throw error;
  }
  // } else {
  //   const error = { body: { errors: [{ message: "User is not authorized" }] } };
  //   throw error;
  // }
}

export async function deleteHalalColumn(userId, columnName) {
  // const commandUserId = getCommandNameByUserId(userId);

  // if (commandUserId === "חיל הלוגיסטיקה") {
  const apiUrl = `http://localhost:5000/api/halals/columns/delete`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "DELETE",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  console.log(userId, columnName);
  const body = JSON.stringify({ userId, columnName });

  try {
    const response = await del(apiUrl, headers, body);
    return response.data;
  } catch (error) {
    console.error(`Error deleting halal column '${columnName}':`, error);
    throw error;
  }
  // } else {
  //   const error = { body: { errors: [{ message: "User is not authorized" }] } };
  //   throw error;
  // }
}
