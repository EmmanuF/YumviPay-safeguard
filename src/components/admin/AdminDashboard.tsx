
import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, ArrowUpRight, ArrowDownRight, DollarSign, 
  AlertTriangle, CheckCircle, Clock, ShieldAlert
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const AdminDashboard: React.FC = () => {
  // Mock data for dashboard
  const stats = [
    { 
      title: 'Total Users', 
      value: '2,845', 
      change: '+12.5%', 
      isPositive: true,
      icon: <User className="text-blue-500" size={20} />,
      color: 'bg-blue-50 border-blue-100'
    },
    { 
      title: 'Transactions', 
      value: '35,621', 
      change: '+23.1%', 
      isPositive: true,
      icon: <DollarSign className="text-green-500" size={20} />,
      color: 'bg-green-50 border-green-100'  
    },
    { 
      title: 'Failed Txs', 
      value: '124', 
      change: '-5.2%', 
      isPositive: true,
      icon: <AlertTriangle className="text-amber-500" size={20} />,
      color: 'bg-amber-50 border-amber-100'
    },
    { 
      title: 'Pending KYC', 
      value: '76', 
      change: '+8.7%', 
      isPositive: false,
      icon: <ShieldAlert className="text-red-500" size={20} />,
      color: 'bg-red-50 border-red-100'
    },
  ];
  
  const recentTransactions = [
    { id: 'TX123456', user: 'John Doe', amount: '$250.00', status: 'completed', date: '2023-05-15 14:32' },
    { id: 'TX123457', user: 'Jane Smith', amount: '$120.00', status: 'completed', date: '2023-05-15 13:21' },
    { id: 'TX123458', user: 'Robert Johnson', amount: '$500.00', status: 'pending', date: '2023-05-15 11:45' },
    { id: 'TX123459', user: 'Emily Chen', amount: '$75.00', status: 'failed', date: '2023-05-15 10:18' },
    { id: 'TX123460', user: 'Michael Brown', amount: '$320.00', status: 'completed', date: '2023-05-15 09:03' },
  ];
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-amber-500" />;
      case 'failed':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`p-4 border ${stat.color}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className="p-2 rounded-full bg-white shadow-sm">
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-center mt-3">
                {stat.isPositive ? (
                  <ArrowUpRight size={16} className="text-green-500" />
                ) : (
                  <ArrowDownRight size={16} className="text-red-500" />
                )}
                <span className={`text-xs ml-1 ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} this month
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    {tx.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      {getStatusIcon(tx.status)}
                      <span className="ml-1 capitalize">{tx.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">API Services</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Kado Integration</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Authentication</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Webhook Processing</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Degraded</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Clock className="text-blue-500" size={16} />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">Scheduled Maintenance</h4>
                  <p className="text-xs text-blue-600 mt-1">System maintenance scheduled for May 18, 2023 at 02:00 UTC</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="text-amber-500" size={16} />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-amber-800">Webhook Processing Delays</h4>
                  <p className="text-xs text-amber-600 mt-1">Some users may experience delays in transaction confirmations</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
