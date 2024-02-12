import GraveyardItem from "../../components/graveyards/GraveyardItem";
const graveyards = [
  "בית העלמין הצבאי חולון",
  "בית העלמין הצבאי חולון",
  "בית העלמין הצבאי חולון",
  "בית העלמין הצבאי חולון",
  "בית העלמין הצבאי חולון",
  "בית העלמין הצבאי חולון",
];
export default function ManageGraveyardsPage() {
  return graveyards.map((index, graveyard) => {
    return (
      <GraveyardItem key={index} graveyardName={graveyard}></GraveyardItem>
    );
  });
}
