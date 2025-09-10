
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
       <div className="w-12 h-12 border-4 border-t-transparent border-dark-blue rounded-full animate-spin mb-4"></div>
       <p className="text-lg text-slate-600 font-medium">Calculating water footprint...</p>
       <p className="text-sm text-slate-500 mt-1">This may take a moment.</p>
    </div>
  );
};

export default Loader;
