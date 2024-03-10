import { get, post, patch, del } from "./api";

const port = process.env.REACT_APP_API_PORT || 5000;

export async function getLeftOvers() {
  const apiUrl = `http://localhost:${port}/api/leftovers/`;

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
    console.error("Error fetching leftovers:", error);
    throw error;
  }
}

export async function getLeftOverById(leftOverId) {
  const apiUrl = `http://localhost:${port}/api/leftovers/${leftOverId}`;

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
    console.error(`Error fetching leftover with id ${leftOverId}:`, error);
    throw error;
  }
}

export async function getLeftOversByHalalId(halalId) {
  const apiUrl = `http://localhost:${port}/api/leftovers/byHalal/${halalId}`;

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
    console.error(`Error fetching leftovers for halal id ${halalId}:`, error);
    throw error;
  }
}

export async function createLeftOver(userId, leftOverData) {
  const apiUrl = `http://localhost:${port}/api/leftovers/`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "POST",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  const body = JSON.stringify({ userId, leftOverData });

  console.log(body);
  try {
    const response = await post(apiUrl, body, headers);
    return response.data;
  } catch (error) {
    console.error("Error creating leftover:", error);
    throw error;
  }
}

export async function updateLeftOver(userId, leftOverId, updatedLeftOverData) {
  const apiUrl = `http://localhost:${port}/api/leftovers/${leftOverId}`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "PATCH",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  const body = JSON.stringify({ userId, updatedLeftOverData });

  try {
    const response = await patch(apiUrl, body, headers);
    return response.data;
  } catch (error) {
    console.error(`Error updating leftover with id ${leftOverId}:`, error);
    throw error;
  }
}

export async function deleteLeftOver(userId, leftOverId) {
  const apiUrl = `http://localhost:${port}/api/leftovers/${leftOverId}`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "DELETE",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  const body = JSON.stringify({ userId });

  try {
    const response = await del(apiUrl, headers, body);
    return response.data;
  } catch (error) {
    console.error(`Error deleting leftover with id ${leftOverId}:`, error);
    throw error;
  }
}
