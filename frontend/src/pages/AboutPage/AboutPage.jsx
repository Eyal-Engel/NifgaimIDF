import React from "react";
import { createHalal } from "../../utils/api/halalsApi";

export default function AboutPage() {
  // Assuming you have a function for creating Halals like the provided `createHalal` function

  // Helper function to generate a random number within a range
  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function generateHalals() {
    const userId = "86c85273-3d8b-4ecd-8f84-f769f0ce517a";
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
      nifgaimCommandId: "a5deef7e-758e-4fc0-9b31-cd544107ebd2",
      nifgaimGraveyardId: "b3a9ecdb-0750-457c-8a25-72389f8384b2",
      nifgaimLeftOverId: "e4f98e98-fac9-4338-9912-7ab02252bd0f",
      nifgaimSoldierAccompaniedId: "bc1e848b-729f-4c2b-b258-699146eb02bd",
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
