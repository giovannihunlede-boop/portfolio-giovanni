import React, { useEffect } from 'react'

interface ModalProps {
  id: string
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ id, isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      id={id}
      className={`demo-modal ${isOpen ? 'open' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className="demo-modal-content">
        <button className="demo-close" onClick={onClose}>
          &times;
        </button>

        <div className="demo-container">
          <header className="demo-header">
            <h1>{title}</h1>
          </header>

          <main className="demo-main">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default Modal
