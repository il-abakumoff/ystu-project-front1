"use client";

import React, { useEffect, useRef } from "react";
import attributes from "@/styles/Attributes.module.css";
import { Discipline } from "@/app/types";

interface AttributesPanelProps {
  selectedDiscipline: Discipline | null;
  handleAttributeChange: (field: keyof Discipline, value: any) => void;
  competenceOptions: string[];
  handleAddCompetence: (competence: string) => void;
  handleRemoveCompetence: (competence: string) => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  showAllCompetences: boolean;
  setShowAllCompetences: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AttributesPanel = ({
  selectedDiscipline,
  handleAttributeChange,
  competenceOptions,
  handleAddCompetence,
  handleRemoveCompetence,
  searchQuery,
  setSearchQuery,
  showAllCompetences,
  setShowAllCompetences,
}: AttributesPanelProps) => {
  const searchInputRef = useRef<HTMLDivElement>(null);

  const handleNumberChange = (
    field: keyof Discipline,
    value: string,
    min: number = 0
  ) => {
    const numericValue = Number(value);
    const finalValue = isNaN(numericValue) ? min : Math.max(numericValue, min);
    handleAttributeChange(field, finalValue);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowAllCompetences(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isInvalidCredits = selectedDiscipline
    ? selectedDiscipline.credits >= 10 || selectedDiscipline.credits <= 0
    : false;

  const isInvalidHours = selectedDiscipline
    ? selectedDiscipline.lectureHours + selectedDiscipline.labHours + selectedDiscipline.practicalHours <= 0
    : false;

  const isInvalidCompetences = selectedDiscipline
    ? selectedDiscipline.competenceCodes.length === 0
    : false;

  const isInvalidDepartment = selectedDiscipline
    ? !selectedDiscipline.department
    : false;

  return (
    <aside className={attributes["attributes"]}>
      <div className={attributes.title}>
        {selectedDiscipline
          ? `Атрибуты: ${selectedDiscipline.name}`
          : "Атрибуты дисциплин"}
      </div>

      <label>Зачётные единицы</label>
      <input
        type="number"
        className={isInvalidCredits ? attributes.invalid : ""}
        value={selectedDiscipline?.credits ?? 1}
        onChange={(e) => handleNumberChange("credits", e.target.value, 1)}
        disabled={!selectedDiscipline}
        min="1"
      />

      <label>Вид зачёта</label>
      <select
        value={selectedDiscipline?.examType || "Э"}
        onChange={(e) => handleAttributeChange("examType", e.target.value)}
        disabled={!selectedDiscipline}
      >
        <option>Э</option>
        <option>З</option>
        <option>ДЗ</option>
      </select>

      <div className={attributes["checkbox-row"]}>
        <input
          type="checkbox"
          id="courseWork"
          checked={selectedDiscipline?.hasCourseWork || false}
          onChange={(e) =>
            handleAttributeChange("hasCourseWork", e.target.checked)
          }
          disabled={!selectedDiscipline}
        />
        <label htmlFor="courseWork">Наличие курсовой</label>
      </div>

      <div className={attributes["checkbox-row"]}>
        <input
          type="checkbox"
          id="practicalWork"
          checked={selectedDiscipline?.hasPracticalWork || false}
          onChange={(e) =>
            handleAttributeChange("hasPracticalWork", e.target.checked)
          }
          disabled={!selectedDiscipline}
        />
        <label htmlFor="practicalWork">Наличие пр. работ</label>
      </div>

      <label>Выпускающая кафедра</label>
      <select
        className={isInvalidDepartment ? attributes.invalid : ""}
        value={selectedDiscipline?.department || "Кафедра 1"}
        onChange={(e) => handleAttributeChange("department", e.target.value)}
        disabled={!selectedDiscipline}
      >
        <option>ИСТ</option>
        <option>ГН</option>
        <option>Ф</option>
      </select>

      <label>Коды компетенций</label>
      <div
        ref={searchInputRef}
        className={isInvalidCompetences ? attributes.invalid : ""}
      >
        <input
          type="text"
          placeholder="Поиск компетенций"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowAllCompetences(true)}
          disabled={!selectedDiscipline}
        />
        {(searchQuery || showAllCompetences) && (
          <div className={attributes["search-results"]}>
            {competenceOptions
              .filter(
                (option) =>
                  !selectedDiscipline?.competenceCodes.includes(option) &&
                  (searchQuery ? option.includes(searchQuery) : true)
              )
              .map((option) => (
                <div key={option} onClick={() => handleAddCompetence(option)}>
                  {option}
                  <span className={attributes["add-symbol"]}>+</span>
                </div>
              ))}
          </div>
        )}
      </div>
      <div className={attributes["competence-bricks"]}>
        {selectedDiscipline?.competenceCodes.sort().map((code) => (
          <div key={code} onClick={() => handleRemoveCompetence(code)}>
            {code}
          </div>
        ))}
      </div>

      <label>Часы по лекционным</label>
      <input
        type="number"
        className={isInvalidHours ? attributes.invalid : ""}
        value={selectedDiscipline?.lectureHours ?? 0}
        onChange={(e) => handleNumberChange("lectureHours", e.target.value)}
        disabled={!selectedDiscipline}
        min="0"
      />

      <label>Часы по лабораторным</label>
      <input
        type="number"
        className={isInvalidHours ? attributes.invalid : ""}
        value={selectedDiscipline?.labHours ?? 0}
        onChange={(e) => handleNumberChange("labHours", e.target.value)}
        disabled={!selectedDiscipline}
        min="0"
      />

      <label>Часы по практическим</label>
      <input
        type="number"
        className={isInvalidHours ? attributes.invalid : ""}
        value={selectedDiscipline?.practicalHours ?? 0}
        onChange={(e) => handleNumberChange("practicalHours", e.target.value)}
        disabled={!selectedDiscipline}
        min="0"
      />
    </aside>
  );
};
