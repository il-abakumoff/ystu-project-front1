"use client";

import React, { useState, useEffect } from "react";
import modal from "@/styles/Modal.module.css";
import modalContent from "@/styles/ModalContent.module.css";
import sidebar from "@/styles/Sidebar.module.css";

interface Direction {
  id: number;
  name: string;
}

interface InitialModalProps {
  handleInitialModalClose: (semesters: number, directionId?: number) => void;
}

export const InitialModal = ({
                               handleInitialModalClose,
                             }: InitialModalProps) => {
  const [semesters, setSemesters] = useState(8);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const response = await fetch('http://host.docker.internal:8000/directions/');
        if (!response.ok) throw new Error('Ошибка загрузки направлений');
        const data = await response.json();
        setDirections(data);
        if (data.length > 0) {
          setSelectedDirection(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching directions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirections();
  }, []);

  const handleSubmit = () => {
    handleInitialModalClose(semesters, selectedDirection);
  };

  return (
      <div className={modal["modal"]}>
        <div className={modalContent["modalContent"]}>
          <p className={modalContent.title}>Начальная настройка</p>

          <label htmlFor="columnInput">Количество семестров:</label>
          <input
              type="number"
              id="columnInput"
              value={semesters}
              onChange={(e) => setSemesters(Number(e.target.value))}
              min={1}
          />

          <label htmlFor="directionSelect">Направление подготовки:</label>
          {isLoading ? (
              <p>Загрузка направлений...</p>
          ) : (
              <select
                  id="directionSelect"
                  value={selectedDirection}
                  onChange={(e) => setSelectedDirection(Number(e.target.value))}
                  className={modalContent["selectInput"]}
              >
                {directions.map((direction) => (
                    <option key={direction.id} value={direction.id}>
                      {direction.name}
                    </option>
                ))}
              </select>
          )}

          <button
              className={sidebar.addButton}
              onClick={handleSubmit}
              disabled={isLoading}
          >
            Применить
          </button>
        </div>
      </div>
  );
};
