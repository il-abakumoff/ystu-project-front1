"use client";

import React, { useState } from "react";
import header from "@/styles/Header.module.css";
import { ReferenceForm } from "./ReferenceForm";

interface HeaderProps {
    onFileClick: () => void;
    onNewOpenClick: () => void;
    onSaveClick: () => void;
    showFileMenu: boolean;
}

export const Header = ({ onFileClick, onNewOpenClick, onSaveClick, showFileMenu }: HeaderProps) => {
    const [showReferences, setShowReferences] = useState(false);

    return (
        <header className={header["header"]}>
            <img src="/images/logo.png" alt="Логотип" className={header.logo}/>
            <div className={header["file-info"]}>
                <div className={header["file-name"]}>Наименование файла</div>
                <div className={header["file-buttons"]}>
                    <div className={header["file-menu-container"]}>
                        <button onClick={onFileClick}>Файл</button>
                        {showFileMenu && (
                            <div className={header["file-menu"]}>
                                <button onClick={onNewOpenClick}>Открыть/создать</button>
                                <button onClick={onSaveClick}>Сохранить</button>
                            </div>
                        )}
                    </div>
                    <button>Вид</button>
                    <button onClick={() => setShowReferences(!showReferences)}>Справочники</button>
                </div>
            </div>
            {showReferences && <ReferenceForm onClose={() => setShowReferences(false)} />}
        </header>
    );
};