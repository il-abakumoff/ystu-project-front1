"use client";

import React, { useState } from "react";
import header from "@/styles/Header.module.css";
import { ReferenceForm } from "./ReferenceForm";

interface HeaderProps {
    onNewOpenItemClick: () => void;
    onSaveItemClick: () => void;
    directionInfo?: string; // Добавляем новый проп
}

export const Header = ({ onNewOpenItemClick, onSaveItemClick, directionInfo }: HeaderProps) => {
    const [showReferences, setShowReferences] = useState(false);
    const [isFileMenuHovered, setIsFileMenuHovered] = useState(false);

    return (
        <header className={header["header"]}>
            <img src="/images/logo.png" alt="Логотип" className={header.logo}/>
            <div className={header["file-info"]}>
                <div className={header["file-name"]}>
                    {directionInfo || "Новый файл..."} {/* Отображаем информацию или заглушку */}
                </div>
                <div className={header["file-buttons"]}>
                    <div
                        className={header["file-menu-container"]}
                        onMouseEnter={() => setIsFileMenuHovered(true)}
                        onMouseLeave={() => setIsFileMenuHovered(false)}
                    >
                        <button>Файл</button>
                        {isFileMenuHovered && (
                            <div className={header["file-menu"]}>
                                <button onClick={onNewOpenItemClick}>Открыть/создать</button>
                                <button onClick={onSaveItemClick}>Сохранить</button>
                            </div>
                        )}
                    </div>
                    <button>Вид</button>
                    <button onClick={() => setShowReferences(!showReferences)}>Справочники</button>
                </div>
            </div>
            {showReferences && <ReferenceForm onClose={() => setShowReferences(false)}/>}
        </header>
    );
};