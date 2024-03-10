import { get, post, patch, del } from "./api";

const port = process.env.REACT_APP_API_PORT || 5000;

export async function getSoldierAccompanieds() {
  const apiUrl = `http://localhost:${port}/api/soldierAccompanied/`;

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
  const apiUrl = `http://localhost:${port}/api/soldierAccompanied/${soldierAccompaniedId}`;

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
  const apiUrl = `http://localhost:${port}/api/soldierAccompanied/byHalal/${halalId}`;

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

// body example:
// {
//   "soldierAccompaniedData": {
//     "fullName": "John Doe",
//     "privateNumber": "8523691",
//     "rank": "Sergeant",
//     "phone": "+972 50 299 6949",
//     "unit": "Unit XYZ",
//     "comments": "Some comments",
//     "nifgaimHalalId": "8d03738b-10f8-4831-b830-4c38b864d36d"
//   },
//   "userId": "d1e47f3e-b767-4030-b6ab-21bec850ba48"
// }
export async function createSoldierAccompanied(userId, soldierAccompaniedData) {
  const apiUrl = `http://localhost:${port}/api/soldierAccompanied/`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "POST",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  const body = JSON.stringify({ userId, soldierAccompaniedData });

  try {
    const response = await post(apiUrl, body, headers);
    return response.data;
  } catch (error) {
    console.error("Error creating soldier accompanied:", error);
    throw error;
  }
}

// body example:
// {
//   "updatedSoldierAccompaniedData": {
//     "fullName": "Updated Name",
//     "privateNumber": "1234560",
//     "rank": "Lieutenant",
//     "phone": "987-654-3210",
//     "unit": "Updated Unit XYZ",
//     "comments": "Updated comments",
//     "halalId": "3ee1ea11-6e33-4845-b9ad-76ad1957551d"
//   },
//   "userId": "d1e47f3e-b767-4030-b6ab-21bec850ba48"
// }
export async function updateSoldierAccompanied(
  userId,
  soldierAccompaniedId,
  updatedSoldierAccompaniedData
) {
  const apiUrl = `http://localhost:${port}/api/soldierAccompanied/${soldierAccompaniedId}`;

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
    soldierAccompaniedId,
    updatedSoldierAccompaniedData,
  });

  try {
    const response = await patch(apiUrl, body, headers);
    return response.data;
  } catch (error) {
    console.error(
      `Error updating soldier accompanied with id ${soldierAccompaniedId}:`,
      error
    );
    throw error;
  }
}

// body example:
// {
//   "userId": "d1e47f3e-b767-4030-b6ab-21bec850ba48"
// }
export async function deleteSoldierAccompanied(userId, soldierAccompaniedId) {
  const apiUrl = `http://localhost:${port}/api/soldierAccompanied/${soldierAccompaniedId}`;

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
    console.error(
      `Error deleting soldier accompanied with id ${soldierAccompaniedId}:`,
      error
    );
    throw error;
  }
}
