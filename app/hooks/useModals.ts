import { useModal } from "@/app/hooks/useModal";

export const useModals = (setColumns: (columns: number) => void) => {
  const initialModal = useModal(true);
  const coreModal = useModal();

  const handleInitialModalClose = () => {
    const input = document.getElementById("columnInput") as HTMLInputElement;
    setColumns(Math.max(1, parseInt(input.value)));
    initialModal.closeModal();
  };

  const addRow = () => {
    const name = (document.getElementById("newCoreName") as HTMLInputElement)
      .value;
    const color = (document.getElementById("newCoreColor") as HTMLInputElement)
      .value;
    coreModal.closeModal();
    return { name, color };
  };

  return {
    initialModal,
    coreModal,
    handleInitialModalClose,
    addRow,
  };
};
