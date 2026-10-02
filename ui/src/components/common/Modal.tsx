import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  small?: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, small, onClose, children }: ModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={small ? "modal small-modal" : "modal"}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
