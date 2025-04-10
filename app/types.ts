export interface Discipline {
  id: number;
  name: string;
  credits: number;
  examType: string;
  hasCourseWork: boolean;
  hasPracticalWork: boolean;
  department: string;
  competenceCodes: string[];
  lectureHours: number;
  labHours: number;
  practicalHours: number;
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
