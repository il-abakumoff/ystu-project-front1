import { useState } from "react";

// используется для управления выпадающим списком во вкладке "Файл"
export const useFileOperations = () => {
    const [showFileMenu, setShowFileMenu] = useState(false);
    const [showInitialModal, setShowInitialModal] = useState(false);

    const toggleFileMenu = () => setShowFileMenu(!showFileMenu);

    const openInitialModal = () => setShowInitialModal(true);
    const closeInitialModal = () => setShowInitialModal(false);

    return {
        showInitialModal,
        openInitialModal,
        closeInitialModal,
    };
};