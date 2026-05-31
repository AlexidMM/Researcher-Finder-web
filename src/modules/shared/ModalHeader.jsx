import './modal-shell.scss';

export default function ModalHeader({ title, onClose }) {
  return (
    <header className="modal-shell-header">
      <h3>{title}</h3>
      <button className="modal-shell-close" onClick={onClose} aria-label="Cerrar modal">x</button>
    </header>
  );
}