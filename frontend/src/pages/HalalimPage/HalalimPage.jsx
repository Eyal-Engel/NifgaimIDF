import React, { useEffect } from "react";
import { getHalalColumnsAndTypes } from "../../utils/api/halalsApi";

export default function HalalimPage() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHalalColumnsAndTypes();
        console.log(data); // Assuming you want to do something with the data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return <div>Halalim page</div>;
}
