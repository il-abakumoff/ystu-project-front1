import { Discipline } from "@/app/types";
import { useState } from "react";

export const useCompetences = (
  selectedDiscipline: Discipline | null,
  handleAttributeChange: (field: keyof Discipline, value: any) => void,
) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllCompetences, setShowAllCompetences] = useState(false);

  const competenceOptions = ["3.2.4.8", "3.1.5.9", "4.5.6.7", "5.6.7.8"];

  const handleAddCompetence = (competence: string) => {
    if (
      !selectedDiscipline ||
      selectedDiscipline.competenceCodes.includes(competence)
    )
      return;
    const updated = [...selectedDiscipline.competenceCodes, competence];
    handleAttributeChange("competenceCodes", updated);
    setSearchQuery("");
    setShowAllCompetences(false);
  };

  const handleRemoveCompetence = (competence: string) => {
    if (!selectedDiscipline) return;
    const updated = selectedDiscipline.competenceCodes.filter(
      (c) => c !== competence,
    );
    handleAttributeChange("competenceCodes", updated);
  };

  return {
    searchQuery,
    showAllCompetences,
    competenceOptions,
    setSearchQuery,
    setShowAllCompetences,
    handleAddCompetence,
    handleRemoveCompetence,
  };
};
