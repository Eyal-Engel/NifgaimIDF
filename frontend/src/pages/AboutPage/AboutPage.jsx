import React from "react";
import { createHalal } from "../../utils/api/halalsApi";

export default function AboutPage() {
  // Assuming you have a function for creating Halals like the provided `createHalal` function

  // Helper function to generate a random number within a range
  function generateRandomNumber(min, max) {
    const temp = Math.floor(Math.random() * (max - min + 1)) + min;
    return temp.toString();
  }

  async function generateHalals() {
    const userId = "e9403c8c-482a-4914-9b7b-75b5b3eea2e6";
    const halalDataTemplate = {
      lastName: "Doe",
      firstName: "John",
      commandName: "מרכז",
      graveyardName: "csanuhcbuyhasbcy",
      dateOfDeath: "2024-03-03",
      serviceType: "קבע",
      circumstances: "Combat",
      unit: "Alpha Company",
      division: "1st Division",
      specialCommunity: "Veterans",
      area: "Section A",
      plot: "Plot 123",
      line: "Line 1",
      graveNumber: "456",
      permanentRelationship: false,
      comments: "Lorem ipsum dolor sit.",
      nifgaimCommandId: "e55fec19-5e16-4994-b6ed-b09a37c6bf8b",
      nifgaimGraveyardId: "afb098a4-fc05-4172-9b3c-afdc907b5498",
    };

    const halals = [];

    for (let i = 0; i < 20000; i++) {
      const privateNumber = generateRandomNumber(1000000, 9999999); // Generate 7-digit random number
      console.log(halalDataTemplate);
      const halalData = { ...halalDataTemplate, privateNumber };
      try {
        const halal = await createHalal(userId, halalData);
        halals.push(halal);
      } catch (error) {}
    }

    return halals;
  }

  // Usage example
  generateHalals()
    .then((halals) => {
      console.log("Generated Halals:", halals);
    })
    .catch((error) => {
      console.error("Error generating Halals:", error);
    });

  return <div>About page</div>;
}
