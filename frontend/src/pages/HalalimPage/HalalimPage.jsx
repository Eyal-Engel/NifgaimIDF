import React, { useEffect } from "react";
import {
  addHalalColumn,
  deleteHalalColumn,
  getHalalColumnsAndTypes,
} from "../../utils/api/halalsApi";

export default function HalalimPage() {
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
          columnName: "checkcheck",
          dataType: "STRING", // or any other supported data type
          defaultValue: null, // or any other supported afault value
        };
        const response = await addHalalColumn(columnData);
        console.log(response);
      } catch (error) {
        console.log(error.response.data.message)
      }

      try {
        const data = await getHalalColumnsAndTypes();
        console.log(data); // Assuming you want to do something with the data
      } catch (error) {
        console.log(error.response.data.message)
      }

      try {
        const data = await deleteHalalColumn("hello4");
        console.log(data); // Assuming you want to do something with the data
      } catch (error) {
        console.log(error.response.data.message)
        // console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return <div>Halalim page</div>;
}
