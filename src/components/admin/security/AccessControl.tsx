
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Key } from 'lucide-react';

const AccessControl = () => {
  return (
    <Card gradient="blue" hoverEffect>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Access Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p>Manage user roles and permissions.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessControl;
