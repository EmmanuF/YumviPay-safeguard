
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Eye, File, Plus } from 'lucide-react';

const PagesManager = () => {
  const { toast } = useToast();
  
  // Sample pages data
  const [pages, setPages] = useState([
    { id: 1, title: 'Home', slug: '/', isActive: true, lastEdited: '2023-10-01T10:15:00Z' },
    { id: 2, title: 'About Us', slug: '/about', isActive: true, lastEdited: '2023-09-28T14:30:00Z' },
    { id: 3, title: 'How It Works', slug: '/how-it-works', isActive: true, lastEdited: '2023-09-25T11:45:00Z' },
    { id: 4, title: 'Fees', slug: '/fees', isActive: true, lastEdited: '2023-09-22T09:20:00Z' },
    { id: 5, title: 'Contact', slug: '/contact', isActive: true, lastEdited: '2023-09-20T15:10:00Z' },
    { id: 6, title: 'FAQ', slug: '/faq', isActive: false, lastEdited: '2023-09-15T13:25:00Z' },
  ]);
  
  const handleToggleActive = (id: number) => {
    setPages(prev => 
      prev.map(page => 
        page.id === id ? { ...page, isActive: !page.isActive } : page
      )
    );
    
    toast({
      title: "Page Status Updated",
      description: "Page visibility has been updated successfully.",
    });
  };
  
  const handleEditPage = (id: number) => {
    toast({
      title: "Edit Page",
      description: `Opening page editor for page ID: ${id}`,
    });
    // In a real app, this would open the page editor
  };
  
  const handleViewPage = (slug: string) => {
    window.open(slug, '_blank');
  };
  
  const handleAddPage = () => {
    toast({
      title: "Create New Page",
      description: "Opening page creator dialog",
    });
    // In a real app, this would open a dialog to create a new page
  };
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-t-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg text-primary-700">Pages Manager</CardTitle>
            <CardDescription>
              Create, edit and manage website pages
            </CardDescription>
          </div>
          <Button onClick={handleAddPage} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Page</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="border rounded-md">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Page Title</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Last Edited</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{page.slug}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(page.lastEdited).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={page.isActive}
                      onCheckedChange={() => handleToggleActive(page.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleEditPage(page.id)}
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleViewPage(page.slug)}
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PagesManager;
