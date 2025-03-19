
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const SecurityOverview = () => {
  return (
    <Card gradient="teal" hoverEffect>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p>View and manage your system's security settings.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityOverview;
