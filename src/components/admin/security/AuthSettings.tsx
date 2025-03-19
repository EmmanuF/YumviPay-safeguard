
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';

const AuthSettings = () => {
  return (
    <Card gradient="teal" hoverEffect>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Authentication Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p>Configure authentication methods and policies.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthSettings;
