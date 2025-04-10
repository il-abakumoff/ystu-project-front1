"use client";

import React from "react";
import modal from "@/styles/Modal.module.css";
import modalContent from "@/styles/ModalContent.module.css";
import sidebar from "@/styles/Sidebar.module.css";

interface InitialModalProps {
  handleInitialModalClose: () => void;
}

export const InitialModal = ({
  handleInitialModalClose,
}: InitialModalProps) => {
  return (
    <div className={modal["modal"]}>
      <div className={modalContent["modalContent"]}>
        <p className={modalContent.title}>Начальная настройка</p>
        <label htmlFor="columnInput">Количество семестров:</label>
        <input type="number" id="columnInput" defaultValue={8} min={1} />
        <button className={sidebar.addButton} onClick={handleInitialModalClose}>
          Применить
        </button>
      </div>
    </div>
  );
};
