"use client";

import React, { useState } from "react";
import header from "@/styles/Header.module.css";
import { ReferenceForm } from "./ReferenceForm";


export const Header = () => {
    const [showReferences, setShowReferences] = useState(false);

    return (
        <header className={header["header"]}>
            <img src="/images/logo.png" alt="Логотип" className={header.logo}/>
            <div className={header["file-info"]}>
                <div className={header["file-name"]}>Наименование файла</div>
                <div className={header["file-buttons"]}>
                    <button>Файл</button>
                    <button>Вид</button>
                    <button onClick={() => setShowReferences(!showReferences)}>Справочники</button>
                </div>
            </div>
            {showReferences && <ReferenceForm onClose={() => setShowReferences(false)} />}
        </header>
    );
};
