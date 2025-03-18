
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const InfoCards: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest transaction activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Recent transactions will be listed here</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current system performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>System status indicators will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoCards;
