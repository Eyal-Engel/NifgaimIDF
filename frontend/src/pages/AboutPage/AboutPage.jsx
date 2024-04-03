import React, { useState } from "react";
import { createHalal } from "../../utils/api/halalsApi";
import * as XLSX from "xlsx";
import { getCommandIdByName } from "../../utils/api/commandsApi";
import { getGraveyardIdByName } from "../../utils/api/graveyardsApi";
import Swal from "sweetalert2"; // Import SweetAlert2
import { Button } from "@mui/material";

export default function AboutPage() {
  const [jsonData, setJsonData] = useState([]);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";

  const translationDict = {
    "מספר אישי": "privateNumber",
    "שם משפחה": "lastName",
    "שם פרטי": "firstName",
    פיקוד: "nifgaimCommandId",
    "תאריך פטירה": "dateOfDeath",
    "סוג שירות": "serviceType",
    "נסיבות המוות": "circumstances",
    יחידה: "unit",
    חטיבה: "division",
    "קהילה מיוחדת": "specialCommunity",
    "בית קברות": "nifgaimGraveyardId",
    אזור: "area",
    חלקה: "plot",
    שורה: "line",
    "מספר קבר": "graveNumber",
    "קשר קבוע": "permanentRelationship",
    הערות: "comments",
  };

  function generateRandomNumber(min, max) {
    const temp = Math.floor(Math.random() * (max - min + 1)) + min;
    return temp.toString();
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const convertedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      convertToJson(convertedData);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
    reader.readAsArrayBuffer(file);
  };

  function replaceKeys(data, mapping) {
    return data.map((obj) => {
      const newObj = {};
      for (const [key, value] of Object.entries(obj)) {
        newObj[mapping[key] || key] = value;
      }
      return newObj;
    });
  }

  const convertToJson = (convertedData) => {
    console.log("converttojson");
    console.log(convertedData);
    if (!convertedData) return;
    const headers = convertedData[0];
    const jsonData = convertedData.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        if (header === "תאריך פטירה") {
          const dateSerial = row[index];
          const millisecondsPerDay = 24 * 60 * 60 * 1000;
          const date = new Date((dateSerial - 25569) * millisecondsPerDay);
          obj[header] = date;
        } else if (header === "קשר קבוע") {
          obj[header] = row[index] === "כן";
        } else {
          obj[header] = row[index].toString();
        }
      });

      return obj;
    });

    const newData = replaceKeys(jsonData, translationDict);

    console.log(newData);
    setJsonData(newData);
  };

  async function createHalalForEachJson() {
    let createdCount = 0; // Track the number of halals created
    let rowsDidntCreated = [];
    for (let i = 0; i < jsonData.length; i++) {
      const data = jsonData[i];
      try {
        data.nifgaimCommandId = await getCommandIdByName(data.nifgaimCommandId);
        data.nifgaimGraveyardId = await getGraveyardIdByName(
          data.nifgaimGraveyardId
        );
      } catch (error) {
        console.error(error);
      }

      try {
        const newHalal = await createSingleHalal(data);
        console.log(newHalal);
        if (newHalal) {
          createdCount++;
        } else {
          rowsDidntCreated.push(i);
        }
      } catch (error) {
        console.error("Error creating Halal:", error);
      }
    }
    const swalConfig = {
      title: `excel הוספת חללים מקובץ`,
      html: "נוצרו " + createdCount + " חללים מתוך " + jsonData.length,
      icon:
        createdCount === 0
          ? "error"
          : createdCount < jsonData.length
          ? "warning"
          : "success",
    };

    if (rowsDidntCreated.length > 0) {
      swalConfig.html +=
        "<br>החללים בשורות הבאות לא נוצרו: " +
        rowsDidntCreated.join(", ") +
        "<br>";
    }

    Swal.fire(swalConfig);
  }

  async function createSingleHalal(data) {
    try {
      const newHalal = await createHalal(loggedUserId, data);
      return newHalal;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Excel הזנת חללים למערכת מקובץ</h1>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <input type="file" onChange={handleFileChange} />
        <div>
          <Button
            sx={{
              background: "rgb(255,255,255)",
              color: "black",
              borderRadius: "1rem",
            }}
            onClick={createHalalForEachJson}
          >
            יצירת חללים חדשים
          </Button>
        </div>
      </div>
    </div>
  );
}
