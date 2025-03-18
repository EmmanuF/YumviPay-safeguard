
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Filter, Download } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

// Mock transaction data
const mockTransactions = [
  { 
    id: 'txn-001', 
    user: 'John Doe', 
    amount: '250.00', 
    currency: 'USD', 
    recipient: 'Maria Garcia', 
    country: 'CM', 
    status: 'completed', 
    date: '2023-06-15' 
  },
  { 
    id: 'txn-002', 
    user: 'Jane Smith', 
    amount: '150.00', 
    currency: 'EUR', 
    recipient: 'Pierre Dubois', 
    country: 'CM', 
    status: 'processing', 
    date: '2023-06-16' 
  },
  { 
    id: 'txn-003', 
    user: 'Robert Johnson', 
    amount: '320.00', 
    currency: 'USD', 
    recipient: 'John Smith', 
    country: 'NG', 
    status: 'completed', 
    date: '2023-06-17' 
  },
  { 
    id: 'txn-004', 
    user: 'Maria Garcia', 
    amount: '75.50', 
    currency: 'USD', 
    recipient: 'Samuel Osei', 
    country: 'GH', 
    status: 'failed', 
    date: '2023-06-18' 
  },
  { 
    id: 'txn-005', 
    user: 'David Brown', 
    amount: '420.00', 
    currency: 'USD', 
    recipient: 'Jean Kamga', 
    country: 'CM', 
    status: 'completed', 
    date: '2023-06-18' 
  },
  { 
    id: 'txn-006', 
    user: 'Lisa Wilson', 
    amount: '95.00', 
    currency: 'EUR', 
    recipient: 'Aminata Diallo', 
    country: 'SN', 
    status: 'pending', 
    date: '2023-06-19' 
  },
];

const AdminTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // This will be replaced with actual API call
  const { data: transactions = mockTransactions, isLoading } = useQuery({
    queryKey: ['adminTransactions'],
    queryFn: async () => {
      // Placeholder for actual API call
      return mockTransactions;
    },
  });
  
  // Filter transactions based on search term and status
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Transaction Management</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              View and manage all transactions across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.user}</TableCell>
                      <TableCell>{transaction.amount} {transaction.currency}</TableCell>
                      <TableCell>{transaction.recipient}</TableCell>
                      <TableCell>{transaction.country}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
