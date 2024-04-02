import React from "react";
import "../../pages/ManageColumns/ManageColumnsPage.css";
import ReuseableItem from "../ReuseableItem";

const ListOfColumns = ({
  sortColumns,
  originalColumns,
  translationDict,
  handelColumnNameChange,
  handleDeleteColumn,
}) => {
  return (
    <ul className="columns-list">
      {sortColumns.map((column) => (
        <li key={column.columnName}>
          <ReuseableItem
            isColumn={true}
            isNewColumn={
              !originalColumns.some(
                (originColumn) => originColumn === column.columnName
              )
            }
            itemName={translationDict[column.columnName] || column.columnName} // Use translated value if available, otherwise use the original column name
            itemId={column.columnName}
            defaultValue={column.columnDefault}
            handleItemNameChange={handelColumnNameChange}
            handleDeleteItem={handleDeleteColumn}
            columnType={column.columnType}
            enumValues={column.enumValues}
          />
        </li>
      ))}
    </ul>
  );
};
export default React.memo(ListOfColumns);
