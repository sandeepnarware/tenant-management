import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children, size }) {
  const overlayRef = useRef();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={(e) => {
      if (e.target === overlayRef.current) onClose();
    }}>
      <div className={`modal-content ${size || ''}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="btn-icon" onClick={onClose}><i className="fas fa-times" /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
