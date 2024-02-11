import { del, get, patch, post } from "./api";
import { getCommandNameById } from "./commandsApi";

export async function getUsers() {
  const apiUrl = "http://localhost:5000/api/users/";

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "GET",
  };

  try {
    const response = await get(apiUrl, headers);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

export async function getUserById(userId) {
  const apiUrl = `http://localhost:5000/api/users/${userId}`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "GET",
  };

  try {
    const response = await get(apiUrl, headers);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

export async function getUserIdByFullName(fullName) {
  try {
    const users = await getUsers();

    for (let i = 0; i < users.length; i++) {
      if (users[i].fullName === fullName) {
        return users[i].id;
      }
    }

    // If no matching fullNames is found
    return null;
  } catch (error) {
    console.error("Error getting userId by fullname:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

export async function getFullNameById(userId) {
  try {
    const user = await getUserById(userId);

    return user.fullName;
  } catch (error) {
    console.error("Error getting fullname by id:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

export async function getCommandNameByUserId(userId) {
  try {
    const user = await getUserById(userId);

    const commantName = await getCommandNameById(user.commandId);

    return commantName;
  } catch (error) {
    console.error("Error getting command name by user id:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

export async function getCommandIdByUserId(userId) {
  try {
    const user = await getUserById(userId);

    return user.commandId;
  } catch (error) {
    console.error("Error getting command ID by user id:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

export async function createUser(newUser) {
  const apiUrl = "http://localhost:5000/api/users/signup/";

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
    const response = await post(apiUrl, newUser, headers);
    return response.data;
  } catch (error) {
    console.error("Error creating new user:", error);
    return error;
  }
}

export async function updateUser(userId, updatedUserData) {
  const apiUrl = `http://localhost:5000/api/users/${userId}`;

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
    const response = await patch(apiUrl, updatedUserData, headers);
    return response;
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    throw error;
  }
}

export async function deleteUser(userId) {
  const apiUrl = `http://localhost:5000/api/users/${userId}`;

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
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
}