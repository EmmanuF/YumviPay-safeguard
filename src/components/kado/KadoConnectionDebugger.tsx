
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const KadoConnectionDebugger: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-4">
      <Header title="Kado Debugger" showBackButton />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Kado Connection Debugger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This feature is currently being reimplemented.
          </p>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default KadoConnectionDebugger;
