import { get, post, patch, del } from "./api";

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
