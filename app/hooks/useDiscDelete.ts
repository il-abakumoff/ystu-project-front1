import { Discipline, TableRow } from "@/app/types";
import React, { useState } from "react";

export const useDiscDelete = (
  rows: TableRow[],
  setRows: React.Dispatch<React.SetStateAction<TableRow[]>>,
  disciplines: Discipline[],
) => {

    const handleDisciplineDelete = (
        discipline: Discipline,
        rowIndex: number,
        colIndex: number
      ) => {
      
        const updatedRows = rows.map(row => ({
            ...row,
            data: row.data.map(cell => [...cell])
        }));

        updatedRows[rowIndex].data[colIndex] = updatedRows[rowIndex].data[colIndex].filter(
            (dataDiscipline) => dataDiscipline.id !== discipline.id
        );
        
        setRows(updatedRows);    
    }

    return {
        handleDisciplineDelete,
      };
    
};
