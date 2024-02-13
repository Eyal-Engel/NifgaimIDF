import React, { useState } from "react";
import CommandItem from "../../components/commands/CommandItem";
import "./ManageCommandsPage.css";

export default function ManageCommandsPage() {
  const [listOfCommands, setListOfCommands] = useState([
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
    "צפון",
  ]);

  const handelCommandNameChange = (commandIndex, newName) => {
    setListOfCommands((prevCommands) => {
      const updatedCommands = [...prevCommands];
      updatedCommands[commandIndex] = newName;
      return updatedCommands;
    });
  };

  const handleDeleteCommand = (commandIndex) => {
    setListOfCommands((prevCommands) => {
      const updatedCommands = [...prevCommands];
      updatedCommands.splice(commandIndex, 1);
      return updatedCommands;
    });
  };

  return (
    <div className="commandsContainer">
      <h1>רשימת פיקודים</h1>
      <ul className="commands-list">
        {listOfCommands.map((command, index) => (
          <li key={index}>
            <CommandItem
              commandName={command}
              commandIndex={index}
              handelCommandNameChange={handelCommandNameChange}
              handleDeleteCommand={handleDeleteCommand}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
