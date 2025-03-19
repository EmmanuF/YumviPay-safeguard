
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AnalyticsStatCardsProps {
  usersCount: number;
  transactionsCount: number;
  countryCount: number;
}

export const AnalyticsStatCards: React.FC<AnalyticsStatCardsProps> = ({
  usersCount,
  transactionsCount,
  countryCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card gradient="teal" hoverEffect={true}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Users</CardTitle>
          <CardDescription>All registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{usersCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            +12% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card gradient="blue" hoverEffect={true}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Transactions</CardTitle>
          <CardDescription>All processed transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{transactionsCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            +23% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card gradient="teal" hoverEffect={true}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Transaction Volume</CardTitle>
          <CardDescription>Total amount processed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$327,591</div>
          <p className="text-xs text-muted-foreground mt-1">
            +18% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card gradient="orange" hoverEffect={true}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Active Countries</CardTitle>
          <CardDescription>Countries with transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{countryCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            +2 new countries this month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
