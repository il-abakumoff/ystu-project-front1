import { useState } from "react";
import { DirectionData, TableRow, Discipline } from "@/app/types";

export const useSaveMap = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveMap = async (currentDirection: DirectionData, rows: TableRow[]) => {
        if (!currentDirection) {
            throw new Error("Направление не выбрано");
        }

        setIsLoading(true);
        setError(null);

        try {
            const mapCors = rows.map(row => ({
                id: row.id || null, // Для новых ядер без ID
                name: row.name,
                semesters_count: currentDirection.semesters,
                discipline_blocks: transformRowDataToBlocks(row)
            }));

            console.log(mapCors)

            const response = await fetch(
                `http://host.docker.internal:8000/directions/${currentDirection.id}/maps/load`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        direction_id: currentDirection.id,
                        map_cors: mapCors
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Ошибка сохранения: ${response.statusText}`);
            }

            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Неизвестная ошибка");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Вспомогательная функция для преобразования данных строки в блоки дисциплин
    const transformRowDataToBlocks = (row: TableRow) => {
        const blocks: any[] = [];

        row.data.forEach((semesterDisciplines, semesterIndex) => {
            semesterDisciplines.forEach((discipline: Discipline) => {
                blocks.push({
                    discipline_id: discipline.discipline_id,
                    credit_units: discipline.credits,
                    control_type_id: discipline.examTypeId || 1, // Значение по умолчанию
                    lecture_hours: discipline.lectureHours,
                    practice_hours: discipline.practicalHours,
                    lab_hours: discipline.labHours,
                    semester_number: semesterIndex + 1,
                    competencies: discipline.competenceCodes?.map(id => ({ id })) || []
                });
            });
        });

        return blocks;
    };

    return { saveMap, isLoading, error };
};