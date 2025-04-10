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

        const disciplinesWithDefaults = data.map((discipline: Partial<Discipline>) => ({
          credits: 1,
          examType: "Э",
          hasCourseWork: false,
          hasPracticalWork: false,
          department: "ИСТ",
          competenceCodes: [],
          lectureHours: 1,
          labHours: 1,
          practicalHours: 1,
          ...discipline,
        }));
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
