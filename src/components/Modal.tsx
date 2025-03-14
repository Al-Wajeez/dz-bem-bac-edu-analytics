import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Replace '#root' with your app's root element ID

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isDarkMode: boolean; // Accept dark mode state as a prop
}

const CustomModal: React.FC<ModalProps> = ({ isOpen, onClose, children, isDarkMode }) => {
  return (
      <div className={`relative bg-white p-6 my-12 ${isDarkMode ? 'dark-mode' : ''}`}>
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 ${isDarkMode ? 'dark-mode' : ''}`}
          aria-label="Close"
        >
        </button>
        <div className={`overflow-y-auto max-h-[80vh] ${isDarkMode ? 'dark-mode' : ''}`}>{children}</div>
      </div>

  );
};

export default CustomModal;