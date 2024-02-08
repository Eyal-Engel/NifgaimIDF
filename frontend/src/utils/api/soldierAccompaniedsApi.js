import { get, post, patch, del } from "./api";

export async function getSoldierAccompanieds() {
  const apiUrl = "http://localhost:5000/api/soldierAccompanieds/";

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
    console.error("Error fetching soldier accompanieds:", error);
    throw error;
  }
}

export async function getSoldierAccompaniedById(soldierAccompaniedId) {
  const apiUrl = `http://localhost:5000/api/soldierAccompanieds/${soldierAccompaniedId}`;

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
    console.error(
      `Error fetching soldier accompanied with id ${soldierAccompaniedId}:`,
      error
    );
    throw error;
  }
}

export async function getSoldierAccompaniedsByHalalId(halalId) {
  const apiUrl = `http://localhost:5000/api/soldierAccompanieds/byHalal/${halalId}`;

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
    console.error(
      `Error fetching soldier accompanieds for halal id ${halalId}:`,
      error
    );
    throw error;
  }
}

export async function createSoldierAccompanied(soldierAccompaniedData) {
  const apiUrl = "http://localhost:5000/api/soldierAccompanieds/";

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
    const response = await post(
      apiUrl,
      JSON.stringify(soldierAccompaniedData),
      headers
    );
    return response.data;
  } catch (error) {
    console.error("Error creating soldier accompanied:", error);
    throw error;
  }
}

export async function updateSoldierAccompanied(
  soldierAccompaniedId,
  updatedSoldierAccompaniedData
) {
  const apiUrl = `http://localhost:5000/api/soldierAccompanieds/${soldierAccompaniedId}`;

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
      JSON.stringify(updatedSoldierAccompaniedData),
      headers
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating soldier accompanied with id ${soldierAccompaniedId}:`,
      error
    );
    throw error;
  }
}

export async function deleteSoldierAccompanied(soldierAccompaniedId) {
  const apiUrl = `http://localhost:5000/api/soldierAccompanieds/${soldierAccompaniedId}`;

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
    console.error(
      `Error deleting soldier accompanied with id ${soldierAccompaniedId}:`,
      error
    );
    throw error;
  }
}
