import { useEffect } from 'react'
import '../styles/Modal.css'

export default function Modal({ children, onClose, title }) {
  // LOGIC: Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    
    // LOGIC: Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    
    // CLEANUP: Remove listener and restore scroll
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  // LOGIC: Stop clicks inside modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation()
  }

  return (
    // BACKDROP: Clicking here closes modal
    <div className="modal-backdrop" onClick={onClose}>
      
      {/* MODAL CONTENT: Clicking here doesn't close */}
      <div className="modal" onClick={handleModalClick}>
        
        {/* HEADER */}
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button 
            className="modal__close" 
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* BODY: This is where CustomerForm renders */}
        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>
  )
}