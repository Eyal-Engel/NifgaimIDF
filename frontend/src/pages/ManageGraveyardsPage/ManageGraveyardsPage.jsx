import React from "react";
import GraveyardItem from "../../components/graveyards/GraveyardItem";
import "./ManageGraveyardsPage.css";
const graveyards = [
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
];
export default function ManageGraveyardsPage() {
  return (
    <div className="graveyardContainer">
      <h1>רשימת בתי הקברות</h1>
      <ul className="graveyard-list">
        {graveyards.map((graveyard, index) => (
          <li key={index}>
            <GraveyardItem graveyardName={graveyard} />
          </li>
        ))}
      </ul>
    </div>
  );
}
