import { del, get, patch, post } from "./api";
// import { getCommandNameById } from "./commandsApi";

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
    console.error("Error fetching users:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

// export async function getUserIdByFullName(fullName) {
//   try {
//     const users = await getUsers();

//     for (let i = 0; i < users.length; i++) {
//       if (users[i].fullName === fullName) {
//         return users[i].id;
//       }
//     }

//     // If no matching fullNames is found
//     return null;
//   } catch (error) {
//     return error;
//   }
// }

export async function getFullNameById(userId) {
  try {
    const user = await getUserById(userId);

    return user.fullName;
  } catch (error) {
    return error;
  }
}

export async function getCommandNameByUserId(userId) {
  try {
    const user = await getUserById(userId);
    // const commantName = await getCommandNameById(user.nifgaimCommandId);
    // return commantName;
    return user;
  } catch (error) {
    return error;
  }
}

export async function getCommandIdByUserId(userId) {
  try {
    const user = await getUserById(userId);
    return user.nifgaimCommandId;
  } catch (error) {
    return error;
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
  };

  try {
    const response = await post(apiUrl, newUser, headers);
    return response.data;
  } catch (error) {
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
    return error;
  }
}

export async function changePassword(userId, newPassword) {
  const apiUrl = `http://localhost:5000/api/users/password/${userId}`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "PATCH",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  const updatedPasswordData = {
    password: newPassword,
  };

  try {
    const response = await patch(apiUrl, updatedPasswordData, headers);
    return response.data;
  } catch (error) {
    return error;
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
    return error;
  }
}
