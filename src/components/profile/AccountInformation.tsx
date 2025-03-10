
import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AccountInformationProps {
  user: {
    name: string;
    email: string;
    phone: string;
    country: string;
  };
  onEdit: (field: string, value: string) => void;
}

const AccountInformation: React.FC<AccountInformationProps> = ({ user, onEdit }) => {
  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'name': return <User className="text-primary-500" />;
      case 'email': return <Mail className="text-primary-500" />;
      case 'phone': return <Phone className="text-primary-500" />;
      case 'country': return <MapPin className="text-primary-500" />;
      default: return <User className="text-primary-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {['name', 'email', 'phone', 'country'].map((field) => (
          <div key={field} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center">
              {getFieldIcon(field)}
              <div className="ml-3">
                <p className="text-sm font-medium capitalize">{field}</p>
                <p className="text-sm text-muted-foreground">{user[field as keyof typeof user]}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(field, user[field as keyof typeof user])}>
              Edit
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AccountInformation;
