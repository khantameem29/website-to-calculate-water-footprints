
import React from 'react';

const WaterDropIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 2.454 1.135 4.685 2.94 6.258 1.148.976 2.023 2.228 2.023 3.51V21.75a.75.75 0 001.5 0v-.222c0-1.282.875-2.534 2.023-3.51 1.805-1.573 2.94-3.804 2.94-6.258 0-5.385-4.365-9.75-9.75-9.75z" />
  </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <WaterDropIcon className="w-8 h-8 text-accent-blue mr-3" />
        <h1 className="text-2xl md:text-4xl font-bold text-dark-blue tracking-tight">
          AquaTrack
        </h1>
      </div>
    </header>
  );
};

export default Header;
