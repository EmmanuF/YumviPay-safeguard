
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileKey } from 'lucide-react';

const Encryption = () => {
  return (
    <Card gradient="orange" hoverEffect>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileKey className="w-5 h-5" />
          Encryption Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p>Manage encryption keys and settings.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Encryption;
