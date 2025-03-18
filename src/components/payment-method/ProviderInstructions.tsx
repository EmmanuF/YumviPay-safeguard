
import React from 'react';

interface ProviderInstructionsProps {
  instructions?: string[];
}

const ProviderInstructions: React.FC<ProviderInstructionsProps> = ({ instructions }) => {
  if (!instructions || instructions.length === 0) return null;

  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
      <h4 className="font-medium text-blue-800 mb-2">Instructions:</h4>
      <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
        {instructions.map((instruction, idx) => (
          <li key={idx}>{instruction}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProviderInstructions;
