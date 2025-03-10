
import React, { useState } from 'react';
import { 
  DownloadCloud,
  FileText,
  FileSpreadsheet,
  MoreHorizontal
} from 'lucide-react';
import { 
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui';
import { Transaction } from '@/types/transaction';
import { 
  exportTransactionsToCSV,
  exportTransactionsToPDF
} from '@/utils/exportUtils';

interface ExportButtonProps {
  transactions: Transaction[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ transactions }) => {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      setIsExporting(true);
      
      if (format === 'csv') {
        exportTransactionsToCSV(transactions);
      } else {
        exportTransactionsToPDF(transactions);
      }
    } catch (error) {
      console.error(`Error exporting to ${format}:`, error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          disabled={isExporting || transactions.length === 0}
          aria-label="Export options"
        >
          {isExporting ? (
            <span className="animate-spin">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <DownloadCloud className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
