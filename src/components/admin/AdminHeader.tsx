
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Sun, 
  Moon, 
  Search, 
  HelpCircle, 
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const AdminHeader = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real implementation, this would toggle dark mode
    toast({
      title: `${!isDarkMode ? 'Dark' : 'Light'} mode activated`,
      description: "Theme preference has been updated.",
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You are being logged out of the admin panel.",
    });
    setTimeout(() => navigate('/'), 1000);
  };
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex-1 min-w-0 flex items-center">
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 py-2 border-gray-300 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm rounded-md"
            />
          </div>
        </div>
        
        <div className="ml-4 flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            className="text-gray-500 hover:text-gray-700"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost" 
            size="icon"
            className="text-gray-500 hover:text-gray-700 relative"
            onClick={() => toast({
              title: "Notifications",
              description: "You have no new notifications.",
            })}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </Button>
          
          <Button
            variant="ghost" 
            size="icon"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => toast({
              title: "Help",
              description: "Help documentation will be displayed here.",
            })}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                  <User className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
