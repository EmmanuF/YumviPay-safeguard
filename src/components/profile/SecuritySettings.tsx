
import React from 'react';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SecuritySettingsProps {
  onChangePassword: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onChangePassword }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Security</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <Shield className="text-primary-500" />
            <div className="ml-3">
              <p className="text-sm font-medium">Password</p>
              <p className="text-sm text-muted-foreground">Change your password</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onChangePassword}>
            Change
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
