
import React from 'react';

interface SampleItemsProps {
  onSampleClick: (item: string) => void;
  disabled: boolean;
}

const SAMPLES = [
  '1 cup of coffee',
  '1 cotton T-shirt',
  '1 kg of beef',
  'A bar of chocolate',
  '1 liter of milk'
];

const SampleItems: React.FC<SampleItemsProps> = ({ onSampleClick, disabled }) => {
  return (
    <div className="text-center mb-10">
      <p className="text-slate-600 mb-3">Or try one of these examples:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {SAMPLES.map(sample => (
          <button
            key={sample}
            onClick={() => onSampleClick(sample)}
            disabled={disabled}
            className="px-4 py-2 bg-white text-dark-blue border border-medium-blue rounded-full text-sm font-medium hover:bg-light-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sample}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SampleItems;
