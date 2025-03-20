import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  isDarkMode?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, isDarkMode }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`
          shadow absolute z-50 px-2 py-1 text-sm rounded-md whitespace-nowrap -top-8 left-1/2 transform -translate-x-1/2
          ${isDarkMode 
            ? 'bg-gray-700 text-gray-100' 
            : 'bg-white text-gray-800'
          }
        `}>
          {content}
          <div className={`
            shadow absolute w-2 h-2 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1
            ${isDarkMode ? 'bg-gray-700' : 'bg-white'}
          `}></div>
        </div>
      )}
    </div>
  );
}; 