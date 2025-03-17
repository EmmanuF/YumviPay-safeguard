
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Recipient } from '@/types/recipient';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CountrySelector from '@/components/CountrySelector';

interface RecipientFormProps {
  recipient?: Recipient;
  onSubmit: (data: Omit<Recipient, 'id' | 'lastUsed' | 'usageCount' | 'verified'>) => void;
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
  const [category, setCategory] = useState(recipient?.category || 'other');
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
      setCategory(recipient.category || 'other');
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
        category
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
        <div className="mt-2 flex items-start gap-2 p-2 bg-amber-50 rounded-md">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            Important: The recipient name must exactly match the name registered on their mobile money or bank account. Mismatched names may cause transaction delays or funds being sent to the wrong person.
          </p>
        </div>
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
        <Label htmlFor="category" className="text-sm font-medium mb-1.5 block">
          Category
        </Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="family">Family</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="frequent">Frequent</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
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
