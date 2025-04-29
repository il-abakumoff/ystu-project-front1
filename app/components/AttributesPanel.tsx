"use client";

import React, {useEffect, useRef, useState} from "react";
import attributes from "@/styles/Attributes.module.css";
import {Discipline} from "@/app/types";

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
    onClose: () => void;
}

interface ControlType {
    id: number;
    name: string;
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
                                    onClose,
                                }: AttributesPanelProps) => {
    const searchInputRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [panelWidth, setPanelWidth] = useState(300);
    const [controlTypes, setControlTypes] = useState<ControlType[]>([]);
    const [loadingControlTypes, setLoadingControlTypes] = useState(false);
    const [creditsError, setCreditsError] = useState<string | null>(null);

    const handleNumberChange = (
        field: keyof Discipline,
        value: string,
        min: number = 0
    ) => {
        const numericValue = Number(value);
        const finalValue = isNaN(numericValue) ? min : Math.max(numericValue, min);
        handleAttributeChange(field, finalValue);
    };

    const startResizing = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const calculateCredits = (lecture: number, practical: number, lab: number) => {
        const totalHours = lecture + practical + lab;
        const calculatedCredits = Math.floor(totalHours / 36);
        const exactValue = totalHours / 36;

        if (totalHours <= 0) {
            setCreditsError("Общее количество часов должно быть больше 0");
            return false;
        } else if (totalHours % 36 !== 0) {
            setCreditsError(`Зачетные единицы рассчитаны как ${calculatedCredits} (${exactValue.toFixed(2)} до округления)`);
            return false;
        } else {
            setCreditsError(null);
            return true;
        }
    };

    const handleHoursChange = (field: keyof Discipline, value: string) => {
        if (!selectedDiscipline) return;

        const numericValue = Number(value);
        const finalValue = isNaN(numericValue) ? 0 : Math.max(numericValue, 0);

        handleAttributeChange(field, finalValue);

        const lecture = field === 'lectureHours' ? finalValue : selectedDiscipline.lectureHours;
        const practical = field === 'practicalHours' ? finalValue : selectedDiscipline.practicalHours;
        const lab = field === 'labHours' ? finalValue : selectedDiscipline.labHours;

        const isValid = calculateCredits(lecture, practical, lab);
        if (isValid) {
            const newCredits = Math.floor((lecture + practical + lab) / 36);
            handleAttributeChange('credits', newCredits);
        }
    };

    useEffect(() => {
        const fetchControlTypes = async () => {
            setLoadingControlTypes(true);
            try {
                const response = await fetch('http://host.docker.internal:8000/control-types');
                if (!response.ok) {
                    throw new Error('Ошибка загрузки видов контроля');
                }
                const data: ControlType[] = await response.json();
                setControlTypes(data);
            } catch (error) {
                console.error('Ошибка при загрузке видов контроля:', error);
            } finally {
                setLoadingControlTypes(false);
            }
        };

        fetchControlTypes();
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !panelRef.current) return;

            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 250 && newWidth < 450) {
                setPanelWidth(newWidth);
                panelRef.current.style.width = `${newWidth}px`;
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

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

    useEffect(() => {
        if (selectedDiscipline) {
            const { lectureHours, labHours, practicalHours } = selectedDiscipline;
            calculateCredits(lectureHours, labHours, practicalHours);
        } else {
            setCreditsError(null);
        }
    }, [selectedDiscipline]); // Зависимость от selectedDiscipline

    const isInvalidHours = selectedDiscipline
        ? selectedDiscipline.lectureHours + selectedDiscipline.labHours + selectedDiscipline.practicalHours <= 0
        : false;

    const isInvalidCredits = false;

    const isInvalidCompetences = selectedDiscipline
        ? selectedDiscipline.competenceCodes.length === 0
        : false;

    const isInvalidDepartment = selectedDiscipline
        ? !selectedDiscipline.department
        : false;

    const getShortExamType = (name: string): string => {
        if (!name) return '';
        // Берем первый символ и делаем заглавным
        return name.charAt(0).toUpperCase();
    };


    return (
        <aside
            className={attributes.attributes}
            ref={panelRef}
            style={{width: `${panelWidth}px`}}
        >

            <div
                className={attributes["resize-handle"]}
                onMouseDown={startResizing}
            />

            <div className={attributes.title}>
                {selectedDiscipline
                    ? `Атрибуты: ${selectedDiscipline.name}`
                    : "Атрибуты дисциплин"}

                <button
                    className={attributes["close-button"]}
                    onClick={onClose}
                    aria-label="Закрыть панель атрибутов"
                >
                    ×
                </button>
            </div>

            <label>Вид контроля</label>
            <select
                value={selectedDiscipline?.examTypeId || ""}
                onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    const selectedType = controlTypes.find(t => t.id === selectedId);
                    const shortName = getShortExamType(selectedType?.name || "");
                    handleAttributeChange("examType", shortName || "");
                    handleAttributeChange("examTypeId", selectedType?.id || null);
                }}
                disabled={!selectedDiscipline || loadingControlTypes}
            >
                {loadingControlTypes ? (
                    <option>Загрузка...</option>
                ) : (
                    controlTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))
                )}
            </select>

            <label>Часы лекционные</label>
            <input
                type="number"
                className={isInvalidHours ? attributes.invalid : ""}
                value={selectedDiscipline?.lectureHours ?? 0}
                onChange={(e) => handleHoursChange("lectureHours", e.target.value)}
                disabled={!selectedDiscipline}
                min="0"
            />

            <label>Часы практические</label>
            <input
                type="number"
                className={isInvalidHours ? attributes.invalid : ""}
                value={selectedDiscipline?.practicalHours ?? 0}
                onChange={(e) => handleHoursChange("practicalHours", e.target.value)}
                disabled={!selectedDiscipline}
                min="0"
            />

            <label>Часы лабораторные</label>
            <input
                type="number"
                className={isInvalidHours ? attributes.invalid : ""}
                value={selectedDiscipline?.labHours ?? 0}
                onChange={(e) => handleHoursChange("labHours", e.target.value)}
                disabled={!selectedDiscipline}
                min="0"
            />

            <label>Зачётные единицы</label>
            <input
                type="number"
                className={creditsError ? attributes.invalid : ""}
                value={selectedDiscipline?.credits ?? 1}
                onChange={(e) => {
                    const value = Math.max(1, Math.min(10, Number(e.target.value)));
                    handleAttributeChange("credits", value);
                    // Перепроверяем часы после ручного изменения ЗЕ
                    if (selectedDiscipline) {
                        const { lectureHours, labHours, practicalHours } = selectedDiscipline;
                        calculateCredits(lectureHours, labHours, practicalHours);
                    }
                }}
                disabled={!selectedDiscipline}
                min="1"
                max="10"
            />
            {creditsError && (
                <div className={attributes.errorMessage}>
                    {creditsError}
                </div>
            )}

            <label>Семестр</label>
            <input
                type="number"
                value={selectedDiscipline?.semester ?? 1}
                onChange={(e) => handleNumberChange("semester", e.target.value, 1)}
                disabled={!selectedDiscipline}
                min="1"
                max="30"
            />

            <label>Ядро</label>
            <input
                type="text"
                value={selectedDiscipline?.core ?? ""}
                onChange={(e) => handleAttributeChange("core", e.target.value)}
                disabled={!selectedDiscipline}
            />
        </aside>
    );
};
