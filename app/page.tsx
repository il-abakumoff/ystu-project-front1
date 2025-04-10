"use client";

import React from "react";
import Head from "next/head";
import container from "@/styles/Container.module.css";
import mainContent from "@/styles/MainContent.module.css";
import table from "@/styles/Table.module.css";
import modal from "@/styles/Modal.module.css";
import { Discipline } from "@/app/types";
import { Alert } from "@/app/components/Alert";
import { InitialModal } from "@/app/components/InitialModal";
import { Header } from "@/app/components/Header";
import { Sidebar } from "@/app/components/Sidebar";
import { SemesterTable } from "@/app/components/SemesterTable";
import { AttributesPanel } from "@/app/components/AttributesPanel";
import { CoreModal } from "@/app/components/CoreModal";
import { useDisciplines } from "@/app/hooks/useDisciplines";
import { useTableState } from "@/app/hooks/useTableState";
import { useAlert } from "@/app/hooks/useAlert";
import { useDragAndDrop } from "@/app/hooks/useDragAndDrop";
import { useDiscDelete } from "./hooks/useDiscDelete";
import { useCompetences } from "@/app/hooks/useCompetences";
import { useModals } from "@/app/hooks/useModals";

const Home = () => {
  const {
    columns,
    rows,
    setColumns,
    setRows,
    calculateTotalCredits,
    calculateColumnCredits,
    addRow,
    handleRowDelete,
  } = useTableState();

  const {
    disciplines,
    selectedDiscipline,
    setSelectedDiscipline,
    handleAttributeChange,
  } = useDisciplines(setRows);

  const { alertMessage, showAlert, closeAlert } = useAlert();

  const { handleDragStart, handleDrop } = useDragAndDrop(
    rows,
    setRows,
    disciplines
  );

  const { handleDisciplineDelete } = useDiscDelete(rows, setRows, disciplines);

  const {
    searchQuery,
    showAllCompetences,
    competenceOptions,
    setSearchQuery,
    setShowAllCompetences,
    handleAddCompetence,
    handleRemoveCompetence,
  } = useCompetences(selectedDiscipline, handleAttributeChange);

  const { initialModal, coreModal, handleInitialModalClose } =
    useModals(setColumns);

  const handleDisciplineClick = (discipline: Discipline) => {
    const actualDiscipline =
      disciplines.find((d) => d.id === discipline.id) || discipline;
    setSelectedDiscipline(actualDiscipline);
  };

  const checkStudyPlan = () => {
    fetch('http://host.docker.internal:8000/validations/validate-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rows),
    })
        .then((response) => response.json())
        .then((data) => {
          showAlert(data.isValid ? "Данные валидны! Ошибок не найдено" : "Данные не валидны! Найдены ошибки в плане обучения.")
        })
        .catch((error) => {
          showAlert(error)
        })
  };

  return (
    <div className={container["container"]}>
      <Head>
        <title>Учебный план</title>
      </Head>

      <Alert message={alertMessage} onClose={closeAlert} />

      {initialModal.isOpen && (
        <InitialModal handleInitialModalClose={handleInitialModalClose} />
      )}

      <Header />

      <div className={mainContent["main-content"]}>
        <Sidebar
          checkStudyPlan={checkStudyPlan}
          disciplines={disciplines}
          selectedDiscipline={selectedDiscipline}
          handleDisciplineClick={handleDisciplineClick}
          handleDragStart={handleDragStart}
        />

        <div className={table["content-wrapper"]}>
          <main className={table.main}>
            <SemesterTable
              columns={columns}
              rows={rows}
              selectedDiscipline={selectedDiscipline ?? undefined}
              handleDisciplineClick={handleDisciplineClick}
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
              calculateTotalCredits={calculateTotalCredits}
              calculateColumnCredits={calculateColumnCredits}
              openCoreModal={coreModal.openModal}
              handleDisciplineDelete={handleDisciplineDelete}
              handleRowDelete={handleRowDelete}
            />
          </main>
        </div>

        <AttributesPanel
          selectedDiscipline={selectedDiscipline}
          handleAttributeChange={handleAttributeChange}
          competenceOptions={competenceOptions}
          handleAddCompetence={handleAddCompetence}
          handleRemoveCompetence={handleRemoveCompetence}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showAllCompetences={showAllCompetences}
          setShowAllCompetences={setShowAllCompetences}
        />
      </div>

      {coreModal.isOpen && (
        <CoreModal
          closeCoreModal={(e) => {
            if ((e.target as HTMLDivElement).className === modal.modal) {
              coreModal.closeModal();
            }
          }}
          addRow={() => {
            addRow();
            coreModal.closeModal();
          }}
        />
      )}
    </div>
  );
};

export default Home;
