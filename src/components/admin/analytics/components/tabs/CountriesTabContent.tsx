
import React from 'react';
import { 
  BarChart, 
  ResponsiveContainer, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CountriesTabContentProps {
  countryChartData: Array<{ name: string; count: number }>;
}

export const CountriesTabContent: React.FC<CountriesTabContentProps> = ({
  countryChartData
}) => {
  return (
    <Card coloredBorder="info" hoverEffect={true}>
      <CardHeader>
        <CardTitle>Top Transaction Countries</CardTitle>
        <CardDescription>Distribution by country</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={countryChartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Transactions" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
