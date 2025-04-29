"use client";

import React, {useState, useRef, useEffect} from "react";
import Head from "next/head";
import container from "@/styles/Container.module.css";
import mainContent from "@/styles/MainContent.module.css";
import errorWindow from "@/styles/errorWindow.module.css";
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

import { ErrorWindow } from "@/app/components/ErrorWindow";

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

  const [isAttributesPanelVisible, setIsAttributesPanelVisible] = useState(true); //

  const [validationResult, setValidationResult] = useState<string>("");
  const [showValidationTab, setShowValidationTab] = useState(false);

  // перемещение окна с результатами ошибок и ресайз
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [size, setSize] = useState({ width: 400, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const tabRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const resizeStartSize = useRef({ width: 0, height: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0 });


  const handleDisciplineClick = (discipline: Discipline) => {
    const actualDiscipline =
      disciplines.find((d) => d.id === discipline.id) || discipline;
    setSelectedDiscipline(actualDiscipline);
    setIsAttributesPanelVisible(true);
  };

  // перемещение окна
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement).className.includes('resize-handle')) return;
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    if (tabRef.current) {
      tabRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y
      });
    } else if (isResizing) {
      const newWidth = resizeStartSize.current.width + (e.clientX - resizeStartPos.current.x);
      const newHeight = resizeStartSize.current.height + (e.clientY - resizeStartPos.current.y);
      setSize({
        width: Math.max(300, newWidth),
        height: Math.max(200, newHeight)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    if (tabRef.current) {
      tabRef.current.style.cursor = 'default';
    }
  };

  // Обработчик для изменения размера
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStartSize.current = { ...size };
    resizeStartPos.current = { x: e.clientX, y: e.clientY };
    if (tabRef.current) {
      tabRef.current.style.cursor = 'nwse-resize';
    }
  };


  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);


  const checkStudyPlan = () => {
    console.log(rows)

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

          setValidationResult(JSON.stringify(data, null, 2)); // Форматируем JSON для читаемости
          setShowValidationTab(true); // Показываем вкладку с результатами

        })
        .catch((error) => {
          showAlert(error)

          setValidationResult(`Ошибка: ${error.message}`);
          setShowValidationTab(true);
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

        {/* Добавляем новую вкладку для отображения результатов */}
        {showValidationTab && (
            <ErrorWindow
                tabRef={tabRef}
                position={position}
                size={size}
                setShowValidationTab={setShowValidationTab}
                validationResult={validationResult}
                handleMouseDown={handleMouseDown}
                handleResizeMouseDown={handleResizeMouseDown}
          />
        )}

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

        {isAttributesPanelVisible && selectedDiscipline && (
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
            onClose={() => setIsAttributesPanelVisible(false)}
          />
        )}
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
