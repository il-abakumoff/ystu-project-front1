"use client";

import React, { useState, useEffect } from "react";
import modal from "@/styles/Modal.module.css";
import modalContent from "@/styles/ModalContent.module.css";
import sidebar from "@/styles/Sidebar.module.css";
import { TableRow } from "@/app/types";

interface CoreModalProps {
  closeCoreModal: (e: React.MouseEvent) => void;
  onAddExistingCore: (core: TableRow) => void;
  onAddNewCore: (coreName: string) => void;
}

interface Core {
  id: number;
  name: string;
  color?: string;
}

export const CoreModal = ({
                            closeCoreModal,
                            onAddExistingCore,
                            onAddNewCore
                          }: CoreModalProps) => {
  const [cores, setCores] = useState<Core[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCoreName, setNewCoreName] = useState("");
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
                onClick={handleCloseClick} // Используем обработчик, который останавливает всплытие
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
                ) : cores.length > 0 ? (
                    cores.map((core) => (
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
              <button
                  className={modalContent.addButton}
                  onClick={handleAddExisting}
                  disabled={!selectedCore || isLoading}
              >
                Добавить из базы
              </button>
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
            </div>
          </div>
        </div>
      </div>
  );
};