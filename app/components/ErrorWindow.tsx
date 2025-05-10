"use client";

import React from "react";
import errorWindow from "@/styles/ErrorWindow.module.css";

interface ErrorWindowProps {
    setShowValidationTab: (value: boolean) => void;
    handleMouseDown: (e: React.MouseEvent) => void;
    handleResizeMouseDown: (e: React.MouseEvent) => void;
    position: { x: number; y: number };
    size: { width: number; height: number };

    tabRef: React.RefObject<HTMLDivElement | null>;

    validationResult: string;

    // checkStudyPlan: () => void;
}

export const ErrorWindow = ({
                                // checkStudyPlan,
                                setShowValidationTab,
                                handleMouseDown,
                                handleResizeMouseDown,
                                tabRef,
                                position,
                                size,
                                validationResult,
                            }: ErrorWindowProps) => {
    return (
        <div
            ref={tabRef}
            className={errorWindow["validation-tab"]}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
                cursor: 'grab'
            }}
            onMouseDown={handleMouseDown}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setShowValidationTab(false);
                }}
                className={errorWindow["close-tab-button"]}
            >x
            </button>
            <h3>Результаты проверки</h3>
            <div className={errorWindow["tab-content"]}>
                <pre>{validationResult}</pre>
            </div>
            <div
                className={errorWindow["resize-handle"]}
                onMouseDown={handleResizeMouseDown}
            />
        </div>
    );
};