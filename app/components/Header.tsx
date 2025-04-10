"use client";

import React from "react";
import header from "@/styles/Header.module.css";

export const Header = () => {
  return (
    <header className={header["header"]}>
      <img src="/images/logo.png" alt="Логотип" className={header.logo} />
      <div className={header["file-info"]}>
        <div className={header["file-name"]}>Наименование файла</div>
        <div className={header["file-buttons"]}>
          <button>Файл</button>
          <button>Вид</button>
        </div>
      </div>
    </header>
  );
};
