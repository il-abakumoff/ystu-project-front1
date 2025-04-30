import { useState } from "react";

export const useFileOperations = () => {
    const [showFileMenu, setShowFileMenu] = useState(false);
    const [showInitialModal, setShowInitialModal] = useState(false);

    const toggleFileMenu = () => setShowFileMenu(!showFileMenu);
    const openInitialModal = () => {
        setShowInitialModal(true);
        setShowFileMenu(false);
    };
    const closeInitialModal = () => setShowInitialModal(false);

    return {
        showFileMenu,
        toggleFileMenu,
        showInitialModal,
        openInitialModal,
        closeInitialModal,
    };
};