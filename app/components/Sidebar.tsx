"use client";

import React, {useState} from "react";
import sidebar from "@/styles/Sidebar.module.css";

interface SidebarProps {
    checkStudyPlan: () => void;
    disciplines: any[];
    selectedDiscipline: any;
    handleDisciplineClick: (discipline: any) => void;
    handleDragStart: (discipline: any) => void;
}

export const Sidebar = ({
                            checkStudyPlan,
                            disciplines,
                            selectedDiscipline,
                            handleDisciplineClick,
                            handleDragStart,
                        }: SidebarProps) => {

    const [searchTerm, setSearchTerm] = useState("");
    const filteredDisciplines = disciplines.filter(discipline => // функция для фильтрации дисциплин
        discipline.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <aside className={sidebar["sidebar"]}>
            <button className={sidebar.checkButton} onClick={checkStudyPlan}>
                Проверить карту учебного плана на наличие ошибок
            </button>
            <div className={sidebar["discipline-list-title"]}>Дисциплины</div>
            <div className={sidebar.searchContainer}>
                <input
                    type="text"
                    placeholder="Поиск дисциплин..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={sidebar.searchInput}
                />
            </div>
            <ul>
                {filteredDisciplines.map((discipline) => (
                    <li
                        key={discipline.id}
                        draggable
                        onDragStart={() => handleDragStart(discipline)}
                        onClick={() => handleDisciplineClick(discipline)}
                        className={`${sidebar.draggableItem} ${
                            selectedDiscipline?.id === discipline.id ? sidebar.selected : ""
                        }`}
                    >
                        {discipline.name}
                    </li>
                ))}
            </ul>
        </aside>
    );
};
