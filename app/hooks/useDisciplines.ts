import {useEffect, useState} from "react";
import { Discipline } from "@/app/types";

export const useDisciplines = (setRows: (rows: any) => void) => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const response = await fetch('http://host.docker.internal:8000/disciplines/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Кэш для хранения данных о кафедрах
        const departmentCache = new Map<number, {short_name: string, name: string}>();

        // Функция для получения данных кафедры
        const fetchDepartmentData = async (departmentId: number) => {
          try {
            // Проверяем кэш
            if (departmentCache.has(departmentId)) {
              return departmentCache.get(departmentId)!;
            }

            const response = await fetch(`http://host.docker.internal:8000/departments/${departmentId}/`);
            if (!response.ok) {
              return {
                short_name: "ИСТ",
                name: "Информационные системы и технологии" // Значение по умолчанию
              };
            }

            const department = await response.json();
            const departmentData = {
              short_name: department.short_name || "ИСТ",
              name: department.name || "Информационные системы и технологии"
            };

            // Сохраняем в кэш
            departmentCache.set(departmentId, departmentData);
            return departmentData;
          } catch (error) {
            console.error('Ошибка получения кафедры:', error);
            return {
              short_name: "ИСТ",
              name: "Информационные системы и технологии"
            };
          }
        };

        // Обрабатываем дисциплины асинхронно
        const disciplinesWithDefaults = await Promise.all(
            data.map(async (discipline: Partial<Discipline>) => {
              let departmentData = {
                short_name: "ИСТ",
                name: "Информационные системы и технологии"
              };

              if (discipline.department_id) {
                departmentData = await fetchDepartmentData(discipline.department_id);
              }

              return {
                credits: 1,
                examType: "Э",
                hasCourseWork: false,
                hasPracticalWork: false,
                department_id: discipline.department_id,
                department_short_name: departmentData.short_name,
                department_name: departmentData.name, // Добавляем полное название
                competenceCodes: [],
                lectureHours: 1,
                labHours: 1,
                practicalHours: 1,
                ...discipline,
              };
            })
        );

        setDisciplines(disciplinesWithDefaults);
      } catch (err) {
        console.error('Ошибка получения дисциплин: ', err);
      }
    };

    fetchDisciplines();
  }, [setRows]);

  const handleAttributeChange = (field: keyof Discipline, value: any) => {
    if (!selectedDiscipline) return;

    const updatedDisciplines = disciplines.map((disc) => {
      if (disc.id === selectedDiscipline.id) {
        return { ...disc, [field]: value };
      }
      return disc;
    });

    setDisciplines(updatedDisciplines);
    setSelectedDiscipline((prev) => prev && { ...prev, [field]: value });

    setRows((prevRows: any[]) =>
      prevRows.map((row) => ({
        ...row,
        data: row.data.map((cell: Discipline[]) =>
          cell.map((d) =>
            d.id === selectedDiscipline.id ? { ...d, [field]: value } : d,
          ),
        ),
      })),
    );
  };

  return {
    disciplines,
    selectedDiscipline,
    setSelectedDiscipline,
    handleAttributeChange,
  };
};
