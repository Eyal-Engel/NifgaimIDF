import { get, post, patch, del } from "./api";
import { getCommandNameByUserId } from "./usersApi";

export async function getCommands() {
  const apiUrl = "http://localhost:5000/api/commands/";

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
    console.error("Error fetching commands:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

export async function getAllCommandsNames() {
  try {
    const commandsNames = [];
    const commands = await getCommands();

    for (let i = 0; i < commands.length; i++) {
      commandsNames.push(commands[i].commandName);
    }
    return commandsNames;
  } catch (error) {
    console.error("Error getting all commands names: ", error);
    throw error;
  }
}

export async function getCommandById(commandId) {
  const apiUrl = `http://localhost:5000/api/commands/${commandId}`;

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
    console.error(`Error getting command by id: ${commandId}:`, error);
    throw error;
  }
}

export async function getCommandIdByName(commandName) {
  try {
    const commands = await getCommands();

    for (let i = 0; i < commands.length; i++) {
      if (commands[i].commandName === commandName) {
        return commands[i].id;
      }
    }

    // If no matching commandName is found
    return null;
  } catch (error) {
    console.error("Error getting commandId by name:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

export async function getCommandNameById(commandId) {
  try {
    const command = await getCommandById(commandId);

    return command.commandName;
  } catch (error) {
    console.error("Error getting command name by id:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

export async function createCommand(userId, commandName) {
  // {body:{ errors: [{message:}]}}
  // const commandUserId = getCommandNameByUserId(userId);

  // if (commandUserId === "חיל הלוגיסטיקה") {
  const apiUrl = "http://localhost:5000/api/commands/";

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "POST",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  const body = JSON.stringify({ commandName, userId });

  try {
    const response = await post(apiUrl, body, headers);
    return response.data;
  } catch (error) {
    throw error;
  }
  // } else {
  //   const error = { body: { errors: [{ message: "User is not authorized" }] } };
  //   throw error;
  // }
}

export async function updateCommandById(userId, commandId, updatedCommand) {
  // const commandUserId = getCommandNameByUserId(userId);

  // if (commandUserId === "חיל הלוגיסטיקה") {
  const apiUrl = `http://localhost:5000/api/commands/${commandId}`;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "PATCH",
    Authorization:
      "Bearer " + JSON.parse(localStorage.getItem("userData"))?.token,
  };

  const body = JSON.stringify({ updatedCommand, userId });
  try {
    const response = await patch(apiUrl, body, headers);
    return response.data;
  } catch (error) {
    console.error(`Error updating command with id ${commandId}:`, error);
    throw error;
  }
  // } else {
  //   const error = { body: { errors: [{ message: "User is not authorized" }] } };
  //   throw error;
  // }
}

export async function deleteCommandById(userId, commandId) {
  // const commandUserId = getCommandNameByUserId(userId);

  // if (commandUserId === "חיל הלוגיסטיקה") {
  const apiUrl = `http://localhost:5000/api/commands/${commandId}`;

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
    console.error(`Error deleting command with id ${commandId}:`, error);
    throw error;
  }
  // } else {
  //   const error = { body: { errors: [{ message: "User is not authorized" }] } };
  //   throw error;
  // }
}
