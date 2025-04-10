"use client";

import React from "react";
import modal from "@/styles/Modal.module.css";
import modalContent from "@/styles/ModalContent.module.css";

interface ConfirmationModalProps {
  confirmationText: string;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;
}

export const ConfirmationModal = ({
  confirmationText,
  handleConfirmDelete,
  handleCancelDelete,
}: ConfirmationModalProps) => {
  return (
    <div className={modal["modal"]}>
      <div className={modalContent["modalContent"]}>
        <p className={modalContent.title}>{confirmationText}</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className={modalContent["confirm"]}
            onClick={handleConfirmDelete}
          >
            Да
          </button>
          <button
            className={modalContent["cancel"]}
            onClick={handleCancelDelete}
          >
            Нет
          </button>
        </div>
      </div>
    </div>
  );
};
