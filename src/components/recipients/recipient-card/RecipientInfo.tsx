
import React from 'react';

interface RecipientInfoProps {
  name: string;
  contact: string;
}

const RecipientInfo: React.FC<RecipientInfoProps> = ({ name, contact }) => {
  return (
    <div>
      <h3 className="font-medium text-gray-900">{name}</h3>
      <p className="text-sm text-gray-500">{contact}</p>
    </div>
  );
};

export default RecipientInfo;
