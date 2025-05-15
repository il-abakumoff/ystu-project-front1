"use client";

import React, { useState, useEffect } from "react";
import modal from "@/styles/Modal.module.css";
import modalContent from "@/styles/ModalContent.module.css";
import {DirectionData, TableRow} from "@/app/types";

interface CoreModalProps {
  closeCoreModal: (e: React.MouseEvent) => void;
  onAddExistingCore: (core: TableRow) => void;
  onAddNewCore: (coreName: string) => void;
  onAddBasedOnCore: (baseCore: TableRow, newName: string) => void; // Новый обработчик
  currentDirection: DirectionData | null;
}

interface Core {
  id: number;
  name: string;
  color?: string;
  semesters_count: number;
}

export const CoreModal = ({
                            closeCoreModal,
                            onAddExistingCore,
                            onAddNewCore,
                            onAddBasedOnCore, // Новый пропс
                            currentDirection
                          }: CoreModalProps) => {
  const [cores, setCores] = useState<Core[]>([]);
  const [filteredCores, setFilteredCores] = useState<Core[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCoreName, setNewCoreName] = useState("");
  const [basedOnCoreName, setBasedOnCoreName] = useState(""); // Новое состояние для имени нового ядра
  const [selectedCore, setSelectedCore] = useState<Core | null>(null);

  // Загрузка ядер из БД
  useEffect(() => {
    const fetchCores = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://host.docker.internal:8000/map-cors/');
        if (!response.ok) throw new Error('Ошибка загрузки ядер');
        const data = await response.json();
        setCores(data);
      } catch (err) {
        console.error('Error loading cores:', err);
        setError(`Ошибка загрузки: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCores();
  }, []);

  useEffect(() => {
    if (currentDirection && cores.length > 0) {
      const filtered = cores.filter(core =>
          core.semesters_count === currentDirection.semesters
      );
      setFilteredCores(filtered);
    } else {
      setFilteredCores(cores);
    }
  }, [cores, currentDirection]);

  const handleAddExisting = () => {
    if (!selectedCore) return;

    onAddExistingCore({
      id: selectedCore.id,
      name: selectedCore.name,
      color: selectedCore.color || "#FFFFFF",
      data: Array(8).fill([])
    });
    closeCoreModal({} as React.MouseEvent);
  };

  const handleAddNew = async () => {
    if (!newCoreName.trim()) {
      setError("Введите название ядра");
      return;
    }

    const exists = cores.some(core =>
        core.name.toLowerCase() === newCoreName.trim().toLowerCase()
    );

    if (exists) {
      setError("Ядро с таким названием уже существует");
      return;
    }

    onAddNewCore(newCoreName.trim());
    closeCoreModal({} as React.MouseEvent);
  };

  // Новый обработчик для создания на основании существующего ядра
  const handleAddBasedOn = () => {
    if (!selectedCore) {
      setError("Выберите ядро для создания на его основе");
      return;
    }

    if (!basedOnCoreName.trim()) {
      setError("Введите название нового ядра");
      return;
    }

    const exists = cores.some(core =>
        core.name.toLowerCase() === basedOnCoreName.trim().toLowerCase()
    );

    if (exists) {
      setError("Ядро с таким названием уже существует");
      return;
    }

    onAddBasedOnCore({
      id: selectedCore.id,
      name: selectedCore.name,
      color: selectedCore.color || "#FFFFFF",
      data: Array(8).fill([])
    }, basedOnCoreName.trim());

    closeCoreModal({} as React.MouseEvent);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeCoreModal(e);
  };

  return (
      <div className={modal["modal"]}>
        <div
            className={modalContent["modalContent"]}
            style={{ width: '800px' }}
        >
          <div className={modalContent["modalHeader"]}>
            <h3>Добавить ядро</h3>
            <button
                onClick={handleCloseClick}
                className={modalContent.closeButton}
            >
              ×
            </button>
          </div>

          {error && <div className={modalContent.errorMessage}>{error}</div>}

          <div className={modalContent.contentContainer}>
            {/* Раздел 1: Список существующих ядер */}
            <div className={modalContent.listColumn}>
              <div className={modalContent.scrollContainer}>
                {isLoading ? (
                    <p>Загрузка ядер...</p>
                ) : filteredCores.length > 0 ? (
                    filteredCores.map((core) => (
                        <div
                            key={core.id}
                            className={`${modalContent.item} ${
                                selectedCore?.id === core.id ? modalContent.selected : ''
                            }`}
                            onClick={() => setSelectedCore(core)}
                        >
                          {core.name}
                        </div>
                    ))
                ) : (
                    <p className={modalContent.emptyState}>Нет доступных ядер</p>
                )}
              </div>
            </div>

            {/* Раздел 2: Создание нового ядра */}
            <div className={modalContent.descriptionColumn}>
              <h4>Создать новое ядро</h4>
              <div className={modalContent.formGroup}>
                <label>Название ядра:</label>
                <input
                    type="text"
                    value={newCoreName}
                    onChange={(e) => setNewCoreName(e.target.value)}
                    placeholder="Введите название ядра"
                />
              </div>
              <button
                  className={modalContent.addButton}
                  onClick={handleAddNew}
                  disabled={isLoading || !newCoreName.trim()}
              >
                Добавить новое
              </button>

              {/* Новый блок для создания на основании */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                <h4>Создать на основании</h4>
                <div className={modalContent.formGroup}>
                  <label>Название нового ядра:</label>
                  <input
                      type="text"
                      value={basedOnCoreName}
                      onChange={(e) => setBasedOnCoreName(e.target.value)}
                      placeholder="Введите название нового ядра"
                  />
                </div>
                <button
                    className={modalContent.addButton}
                    onClick={handleAddBasedOn}
                    disabled={isLoading || !selectedCore || !basedOnCoreName.trim()}
                >
                  Создать на основании
                </button>
                <button
                    className={modalContent.addButton}
                    onClick={handleAddExisting}
                    disabled={!selectedCore || isLoading}
                    style={{ marginTop: '10px' }}
                >
                  Добавить из базы
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};