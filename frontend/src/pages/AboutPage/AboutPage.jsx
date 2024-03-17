import React from "react";
import { createHalal } from "../../utils/api/halalsApi";

export default function AboutPage() {
  // Assuming you have a function for creating Halals like the provided `createHalal` function

  // Helper function to generate a random number within a range
  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function generateHalals() {
    const userId = "d1e47f3e-b767-4030-b6ab-21bec850ba48";
    const halalDataTemplate = {
      lastName: "Doe",
      firstName: "John",
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
      nifgaimCommandId: "07ec94ec-d900-4633-8c40-b47f25ac6a9c",
      nifgaimGraveyardId: "286ad23d-450c-47c4-b23d-377ac18b993b",
      nifgaimLeftOverId: "286ad23d-450c-47c4-b23d-377ac18b993b",
      nifgaimSoldierAccompaniedId: "286ad23d-450c-47c4-b23d-377ac18b993b",
    };

    const halals = [];

    for (let i = 0; i < 150; i++) {
      const privateNumber = generateRandomNumber(1000000, 9999999); // Generate 7-digit random number
      console.log(halalDataTemplate);
      const halalData = { ...halalDataTemplate, privateNumber };
      const halal = await createHalal(userId, halalData);
      halals.push(halal);
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
