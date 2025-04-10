"use client";

import React, { useEffect } from "react";
import modal from "@/styles/Modal.module.css";

interface AlertProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export const Alert = ({ message, onClose, duration = 4899 }: AlertProps) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={modal.alert}>
      <p>{message}</p>
    </div>
  );
};
