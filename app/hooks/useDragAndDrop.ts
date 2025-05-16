import { Discipline, TableRow } from "@/app/types";
import React, { useState } from "react";

export const useDragAndDrop = (
  rows: TableRow[],
  setRows: React.Dispatch<React.SetStateAction<TableRow[]>>,
  disciplines: Discipline[],
) => {
  const [draggedDiscipline, setDraggedDiscipline] = useState<Discipline | null>(null);

  const handleDragStart = (
    discipline: Discipline,
    sourceRowIndex?: number,
    sourceColIndex?: number,
  ) => {
    const template: Discipline = {
      ...discipline,
      sourcePosition: sourceRowIndex !== undefined && sourceColIndex !== undefined 
        ? { rowIndex: sourceRowIndex, colIndex: sourceColIndex }
        : undefined
    };
    
    setDraggedDiscipline(template);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLTableCellElement>,
    rowIndex: number,
    colIndex: number,
    modifier?: (d: Discipline) => Partial<Discipline>
  ) => {
    e.preventDefault();
    if (!draggedDiscipline) return;

    const newId = Date.now() + Math.floor(Math.random() * 1000);

    const newDiscipline: Discipline = {
      ...draggedDiscipline,
      table_id: newId,
      ...(modifier ? modifier(draggedDiscipline) : {}),
      sourcePosition: undefined
    };

    const updatedRows = rows.map(row => ({
      ...row,
      data: row.data.map(cell => [...cell])
    }));

    if (draggedDiscipline.sourcePosition) {
      const { rowIndex: sri, colIndex: sci } = draggedDiscipline.sourcePosition;
      updatedRows[sri].data[sci] = updatedRows[sri].data[sci].filter(
        d => d.table_id !== draggedDiscipline.table_id
      );
    }

    updatedRows[rowIndex].data[colIndex].push(newDiscipline);

    setRows(updatedRows);
    setDraggedDiscipline(null);
    console.log(rowIndex + " " + colIndex)
  };

  return {
    handleDragStart,
    handleDrop,
    handleDragOver: (e: React.DragEvent<HTMLTableCellElement>) => 
      e.preventDefault(),
  };
};
