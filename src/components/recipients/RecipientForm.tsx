
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Recipient } from '@/types/recipient';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CountrySelector from '@/components/CountrySelector';

interface RecipientFormProps {
  recipient?: Recipient;
  onSubmit: (data: Omit<Recipient, 'id' | 'lastUsed'>) => void;
  onCancel: () => void;
}

const RecipientForm: React.FC<RecipientFormProps> = ({
  recipient,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(recipient?.name || '');
  const [contact, setContact] = useState(recipient?.contact || '');
  const [country, setCountry] = useState(recipient?.country || 'CM');
  const [isFavorite, setIsFavorite] = useState(recipient?.isFavorite || false);
  const [errors, setErrors] = useState({
    name: '',
    contact: '',
  });

  useEffect(() => {
    if (recipient) {
      setName(recipient.name);
      setContact(recipient.contact);
      setCountry(recipient.country);
      setIsFavorite(recipient.isFavorite);
    }
  }, [recipient]);

  const validate = () => {
    let valid = true;
    const newErrors = { name: '', contact: '' };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!contact.trim()) {
      newErrors.contact = 'Contact information is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        name,
        contact,
        country,
        isFavorite,
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="name" className="text-sm font-medium mb-1.5 block">
          Recipient Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter recipient name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="contact" className="text-sm font-medium mb-1.5 block">
          Mobile Number or Email
        </Label>
        <Input
          id="contact"
          type="text"
          placeholder="Enter mobile or email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        {errors.contact && (
          <p className="text-xs text-red-500 mt-1">{errors.contact}</p>
        )}
      </div>

      <div>
        <Label htmlFor="country" className="text-sm font-medium mb-1.5 block">
          Country
        </Label>
        <CountrySelector
          label="Select country"
          value={country}
          onChange={setCountry}
          type="receive"
        />
      </div>

      <div className="pt-4 flex gap-3">
        <Button type="submit" className="flex-1">
          {recipient ? 'Update Recipient' : 'Add Recipient'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </motion.form>
  );
};

export default RecipientForm;
