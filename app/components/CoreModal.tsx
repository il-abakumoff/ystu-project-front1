"use client";

import React from "react";
import modal from "@/styles/Modal.module.css";
import modalContent from "@/styles/ModalContent.module.css";
import sidebar from "@/styles/Sidebar.module.css";

interface CoreModalProps {
  closeCoreModal: (e: React.MouseEvent<HTMLDivElement>) => void;
  addRow: () => void;
}

export const CoreModal = ({ closeCoreModal, addRow }: CoreModalProps) => {
  return (
    <div className={modal["modal"]} onClick={closeCoreModal}>
      <div className={modalContent["modalContent"]}>
        <div>
          <p className={modalContent.title}>Добавить ядро</p>
          <label htmlFor="newCoreName">Наименование</label>
          <input type="text" id="newCoreName" defaultValue={"Ядро ИЦС"} />
          <label htmlFor="newCoreColor">Выбор цвета</label>
          <input type="color" id="newCoreColor" defaultValue={"#FF0000"} />
          <button className={sidebar.addButton} onClick={addRow}>
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};
