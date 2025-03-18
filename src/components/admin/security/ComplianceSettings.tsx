
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';

const ComplianceSettings = () => {
  return (
    <Card gradient="blue" hoverEffect>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Compliance Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p>Manage compliance and regulatory settings.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceSettings;
