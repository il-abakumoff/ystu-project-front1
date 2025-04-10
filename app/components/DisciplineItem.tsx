"use client";

import React from "react";
import table from "@/styles/Table.module.css";
import { Discipline } from "@/app/types";

interface DisciplineItemProps {
  discipline: Discipline;
  onClick: () => void;
  onDragStart: () => void;
  deleteDisc: () => void;
  isActive?: boolean;
}

export const DisciplineItem = ({
  discipline,
  onClick,
  onDragStart,
  deleteDisc,
  isActive = false,
}: DisciplineItemProps) => {
  const isInvalid =
    discipline.credits >= 10 ||
    discipline.lectureHours + discipline.labHours + discipline.practicalHours <= 0 ||
    discipline.competenceCodes.length === 0 ||
    !discipline.department;

  return (
    <div
      className={[
        table.disciplineItem,
        isActive ? table.active : "",
        isInvalid ? table.invalidDiscipline : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
    >
      <div className={table.disciplineName} title={discipline.name} lang="ru">{discipline.name}</div>
      <div className={table.disciplineInfo}>
        <span className={table.disciplineInfoItem}>{discipline.examType}</span>
        <span className={table.disciplineInfoItem}>
          {discipline.credits} ЗЕ
        </span>
        <span className={table.disciplineInfoItem}>
          {discipline.department}
        </span>
        <span 
          className={table.deleteButton}
          onClick={deleteDisc}
        >
          <div>X</div>
        </span>
      </div>
    </div>
  );
};
