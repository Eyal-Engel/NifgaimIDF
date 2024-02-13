import React, { useState } from "react";
import GraveyardItem from "../../components/graveyards/GraveyardItem";
import "./ManageGraveyardsPage.css";
// const graveyards = [
//   "בית העלמין הצבאי חולון",
//   "בית העלמין הצבאי חולון",
//   "בית העלמין הצבאי חולון",
//   "בית העלמין הצבאי חולון",
//   "בית העלמין הצבאי חולון",
//   "בית העלמין הצבאי חולון",
//   "בית העלמין הצבאי חולון",
//   "בית העלמין הצבאי חולון",
//   "בית העלמין הצבאי חולון",
//   "בית העלמין הצבאי חולון",
//   "בית העלמין הצבאי חולון",
//   "בית העלמין הצבאי חולון",
// ];
export default function ManageGraveyardsPage() {
  const [listOfGravayards, setListOfGraveyards] = useState([
    "בית העלמין הצבאי חולון",
    "בית העלמין הצבאי חולון",
    "בית העלמין הצבאי חולון",
    "בית העלמין הצבאי חולון",
    "בית העלמין הצבאי חולון",
    "בית העלמין הצבאי חולון",
    "בית העלמין הצבאי חולון",
    "בית העלמין הצבאי חולון",
    "בית העלמין הצבאי חולון",
    "בית העלמין הצבאי חולון",
    "בית העלמין הצבאי חולון",
    "בית העלמין הצבאי חולון",
  ]);

  const handelGraveyardNameChange = (graveyardIndex, newName) => {
    setListOfGraveyards((prevGraveyards) => {
      const updatedGraveyards = [...prevGraveyards];
      updatedGraveyards[graveyardIndex] = newName;
      return updatedGraveyards;
    });
  };

  const handleDeleteGraveyard = (graveyardIndex) => {
    setListOfGraveyards((prevGraveyards) => {
      const updatedGraveyards = [...prevGraveyards];
      updatedGraveyards.splice(graveyardIndex, 1);
      return updatedGraveyards;
    });
  };

  return (
    <div className="graveyardContainer">
      <h1>רשימת בתי הקברות</h1>
      <ul className="graveyard-list">
        {listOfGravayards.map((graveyard, index) => (
          <li key={index}>
            <GraveyardItem
              graveyardName={graveyard}
              graveyardIndex={index}
              handelGraveyardNameChange={handelGraveyardNameChange}
              handleDeleteGraveyard={handleDeleteGraveyard}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
