import { get, post, patch, del } from "./api"; // Assuming you have functions for POST, PATCH, DELETE requests in your API
import { getCommandNameByUserId } from "./usersApi";

export async function getAllGraveyards() {
  const apiUrl = "http://localhost:5000/api/graveyards/";

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
    console.error("Error fetching graveyards:", error);
    throw error;
  }
}

export async function getGraveyardById(graveyardId) {
  const apiUrl = `http://localhost:5000/api/graveyards/${graveyardId}`;

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
    console.error(`Error fetching graveyard with id ${graveyardId}:`, error);
    throw error;
  }
}

export async function createGraveyard(userId, graveyardName) {
  // const commandUserId = getCommandNameByUserId(userId);

  // if (commandUserId === "חיל הלוגיסטיקה") {
  const apiUrl = "http://localhost:5000/api/graveyards/";

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "POST",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  const body = JSON.stringify({ graveyardName, userId });

  try {
    const response = await post(apiUrl, body, headers);
    return response.data;
  } catch (error) {
    console.error("Error creating graveyard:", error);
    throw error;
  }
  // } else {
  //   const error = { body: { errors: [{ message: "User is not authorized" }] } };
  //   throw error;
  // }
}

export async function updateGraveyardById(
  userId,
  graveyardId,
  updatedGraveyard
) {
  // const commandUserId = getCommandNameByUserId(userId);

  // if (commandUserId === "חיל הלוגיסטיקה") {
  const apiUrl = `http://localhost:5000/api/graveyards/${graveyardId}`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "PATCH",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  const body = JSON.stringify({ updatedGraveyard, userId });

  try {
    const response = await patch(apiUrl, body, headers);
    return response.data;
  } catch (error) {
    console.error(`Error updating graveyard with id ${graveyardId}:`, error);
    throw error;
  }
  // } else {
  //   const error = { body: { errors: [{ message: "User is not authorized" }] } };
  //   throw error;
  // }
}

export async function deleteGraveyardById(userId, graveyardId) {
  const commandUserId = getCommandNameByUserId(userId);

  if (commandUserId === "חיל הלוגיסטיקה") {
    const apiUrl = `http://localhost:5000/api/graveyards/${graveyardId}`;

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
      const response = await del(apiUrl, body, headers);

      return response.data;
    } catch (error) {
      console.error(`Error deleting graveyard with id ${graveyardId}:`, error);
      throw error;
    }
  } else {
    const error = { body: { errors: [{ message: "User is not authorized" }] } };
    throw error;
  }
}
