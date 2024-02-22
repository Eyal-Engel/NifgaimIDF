import React, { useEffect } from "react";
import {
  addHalalColumn,
  deleteHalalColumn,
  getHalalColumnsAndTypes,
} from "../../utils/api/halalsApi";

export default function HalalimPage() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHalalColumnsAndTypes();
        console.log(data); // Assuming you want to do something with the data
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const columnData = {
          columnName: "cc3",
          dataType: "STRING", // or any other supported data type
          defaultValue: null, // or any other supported afault value
        };
        const response = await addHalalColumn(loggedUserId, columnData);
        console.log(response);
      } catch (error) {
        console.log(error.response.data.message);
      }

      try {
        const data = await getHalalColumnsAndTypes();
        console.log(data); // Assuming you want to do something with the data
      } catch (error) {
        console.log(error);
      }

      try {
        const data = await deleteHalalColumn(loggedUserId, "cc3");
        console.log(data); // Assuming you want to do something with the data
      } catch (error) {
        console.log(error);
        // console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return <div>Halalim page</div>;
}
