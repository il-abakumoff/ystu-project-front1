export interface Discipline {
  id: number;
  name: string;
  credits: number;
  examType: string; // Будет хранить "Э", "З", "Д" и т.д.
  examTypeId?: number; // Добавляем для хранения ID
  hasCourseWork: boolean;
  hasPracticalWork: boolean;
  department: string;
  competenceCodes: string[];
  lectureHours: number;
  labHours: number;
  practicalHours: number;
  semester?: number; // Добавлено
  core?: string; // Добавлено
  sourcePosition?: {
    rowIndex: number;
    colIndex: number;
  };
}

export interface TableRow {
  name: string;
  color: string;
  data: Discipline[][];
}
