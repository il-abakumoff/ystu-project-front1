import { useState, useEffect } from "react";
import { TableRow } from "@/app/types";

export const useTableState = () => {
  const [columns, setColumns] = useState(8);
  const [rows, setRows] = useState<TableRow[]>([]);

  useEffect(() => {
    const initialRows = [
      {
        name: "Ядро ЯГТУ",
        color: "#F4F65B",
        data: Array(columns)
          .fill([])
          .map(() => []),
      },
      {
        name: "Ядро ИЦС",
        color: "#9CF9A0",
        data: Array(columns)
          .fill([])
          .map(() => []),
      },
      {
        name: "Ядро УГСН",
        color: "#7497FF",
        data: Array(columns)
          .fill([])
          .map(() => []),
      },
    ];
    setRows(initialRows);
  }, [columns]);

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
    const newCoreName =
      (document.getElementById("newCoreName") as HTMLInputElement)?.value ||
      "Новое ядро";
    const newCoreColor =
      (document.getElementById("newCoreColor") as HTMLInputElement)?.value ||
      "#FFFFFF";

    setRows((prev) => [
      ...prev,
      {
        name: newCoreName,
        color: newCoreColor,
        data: Array.from({ length: columns }, () => []),
      },
    ]);
  };

  const handleRowDelete = (rowIndex: number) => {
    setRows((prevRows) => prevRows.filter((_, index) => index !== rowIndex));
  };

  return {
    columns,
    rows,
    setColumns: (newColumns: number) => setColumns(Math.max(1, newColumns)),
    setRows,
    calculateTotalCredits,
    calculateColumnCredits,
    addRow,
    handleRowDelete,
  };
};
