import { useState, useEffect } from "react";
import { TableRow } from "@/app/types";

export const useTableState = (initialColumns = 8) => {
  const [columns, setColumns] = useState(initialColumns);
  const [rows, setRows] = useState<TableRow[]>([]);

  const initializeTable = (semesters: number) => {
    setColumns(semesters);
  };

  useEffect(() => {
    setRows((prevRows) => {
      return prevRows.map((row) => ({
        ...row,
        data: Array.from({ length: columns }, (_, colIndex) =>
          colIndex < row.data.length ? row.data[colIndex] : []
        ),
      }));
    });
  }, [columns]);

  const calculateTotalCredits = () => {
    return rows.reduce((total, row) => {
      return (
        total +
        row.data.reduce((rowTotal, cell) => {
          return (
            rowTotal +
            cell.reduce(
              (cellTotal, discipline) => cellTotal + (discipline?.credits || 0),
              0
            )
          );
        }, 0)
      );
    }, 0);
  };

  const calculateColumnCredits = () => {
    return Array.from({ length: columns }, (_, colIndex) =>
      rows.reduce((total, row) => {
        const cellData = row.data[colIndex] || [];
        return (
          total +
          cellData.reduce(
            (cellTotal, discipline) => cellTotal + (discipline?.credits || 0),
            0
          )
        );
      }, 0)
    );
  };

  const addRow = () => {
    const newCoreName = (document.getElementById("newCoreName") as HTMLInputElement)?.value || "Новое ядро";
    const newCoreColor = (document.getElementById("newCoreColor") as HTMLInputElement)?.value || "#FFFFFF";

    setRows((prev) => [
      ...prev,
      {
        id: undefined, // Новое ядро
        name: newCoreName,
        color: newCoreColor,
        data: Array.from({ length: columns }, () => []),
      },
    ]);
  };

  const handleRowDelete = (rowIndex: number) =>   {
    setRows((prevRows) => prevRows.filter((_, index) => index !== rowIndex));
  };

  const loadCore = (coreData: TableRow) => {
    setRows((prev) => [...prev, coreData]);
  };

  return {
    columns,
    rows,
    setColumns,
    setRows,
    initializeTable, // Добавляем функцию инициализации
    calculateTotalCredits,
    calculateColumnCredits,
    addRow,
    handleRowDelete,
  };
};