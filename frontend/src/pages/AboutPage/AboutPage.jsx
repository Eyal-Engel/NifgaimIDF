import React from "react";
import { createHalal } from "../../utils/api/halalsApi";
import { createSoldierAccompanied } from "../../utils/api/soldierAccompaniedsApi";

export default function AboutPage() {
  // Assuming you have a function for creating Halals like the provided `createHalal` function

  // Helper function to generate a random number within a range
  function generateRandomNumber(min, max) {
    const temp = Math.floor(Math.random() * (max - min + 1)) + min;
    return temp.toString();
  }

  async function generateHalals() {
    const userId = "d1e47f3e-b767-4030-b6ab-21bec850ba48";
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
      // nifgaimCommandId: "e5b9283c-dc2f-4f8f-bdea-618abef5fe22",
      // nifgaimGraveyardId: "286ad23d-450c-47c4-b23d-377ac18b993b",
    };

    const soldierDataTemplate = {
      fullName: "כהן ליאור",
      rank: "Sergeant",
      phone: "+972 50 299 6949",
      unit: "Unit XYZ",
      comments: "Some comments",
      nifgaimHalalId: "ca94cd0f-1b52-44e8-a1f2-773ce83f5e97",
    };

    const halals = [];
    const soldiers = [];

    for (let i = 0; i < 1; i++) {
      const privateNumber = generateRandomNumber(1000000, 9999999); // Generate 7-digit random number
      console.log(halalDataTemplate);
      const halalData = { ...halalDataTemplate, privateNumber };
      const halal = await createHalal(userId, halalData);
      halals.push(halal);
    }

    return halals;

    // for (let i = 0; i < 5000; i++) {
    //   const privateNumber = generateRandomNumber(1000000, 9999999); // Generate 7-digit random number
    //   const soldierData = { ...soldierDataTemplate, privateNumber };
    //   console.log(soldierData);

    //   const sodlier = await createSoldierAccompanied(userId, soldierData);
    //   soldiers.push(sodlier);
    // }

    // return soldiers;
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
