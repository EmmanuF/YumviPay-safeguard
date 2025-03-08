
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Recipient } from '@/types/recipient';
import { useRecipients } from '@/hooks/useRecipients';
import Header from '@/components/Header';
import RecipientCard from '@/components/recipients/RecipientCard';
import RecipientForm from '@/components/recipients/RecipientForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { UserPlus, Star, Search, X } from 'lucide-react';

const Recipients = () => {
  const navigate = useNavigate();
  const { 
    recipients, 
    loading, 
    addRecipient, 
    updateRecipient, 
    deleteRecipient, 
    toggleFavorite,
    updateLastUsed
  } = useRecipients();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);
  const [deletingRecipientId, setDeletingRecipientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredRecipients = recipients
    .filter(recipient => {
      const matchesSearch = recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           recipient.contact.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTab === 'all') return matchesSearch;
      if (activeTab === 'favorites') return matchesSearch && recipient.isFavorite;
      return matchesSearch;
    })
    .sort((a, b) => {
      // Sort by favorite status first, then by last used date
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      
      const dateA = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
      const dateB = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
      return dateB - dateA;
    });

  const handleAddRecipient = async (data: Omit<Recipient, 'id' | 'lastUsed'>) => {
    await addRecipient({
      ...data,
      lastUsed: new Date(),
    });
    setIsAddDialogOpen(false);
  };

  const handleUpdateRecipient = async (data: Omit<Recipient, 'id' | 'lastUsed'>) => {
    if (editingRecipient) {
      await updateRecipient({
        ...editingRecipient,
        ...data,
      });
      setIsEditDialogOpen(false);
      setEditingRecipient(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingRecipientId) {
      await deleteRecipient(deletingRecipientId);
      setIsDeleteDialogOpen(false);
      setDeletingRecipientId(null);
    }
  };

  const handleSelectRecipient = async (recipient: Recipient) => {
    await updateLastUsed(recipient.id);
    navigate('/send', { state: { selectedRecipient: recipient } });
  };

  const handleEditRecipient = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRecipient = (id: string) => {
    setDeletingRecipientId(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Recipients" showBackButton={true} />
      
      <div className="flex-1 p-4">
        <div className="mb-4 flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Recipients</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search recipients..."
            className="pl-9 pr-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-2.5 top-2.5"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        <div className="space-y-3 mb-20">
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading recipients...</div>
          ) : filteredRecipients.length > 0 ? (
            <TabsContent value={activeTab} className="mt-0">
              {filteredRecipients.map((recipient) => (
                <RecipientCard
                  key={recipient.id}
                  recipient={recipient}
                  onSelect={handleSelectRecipient}
                  onEdit={handleEditRecipient}
                  onDelete={handleDeleteRecipient}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </TabsContent>
          ) : (
            <div className="py-10 text-center">
              <div className="bg-gray-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3">
                <UserPlus className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="text-gray-700 font-medium">No recipients found</h3>
              <p className="text-gray-500 text-sm mt-1">
                {searchQuery 
                  ? "Try a different search query" 
                  : activeTab === 'favorites'
                    ? "You don't have any favorite recipients yet"
                    : "Add your first recipient to get started"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 left-0 right-0 px-4">
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          className="w-full shadow-lg"
          size="lg"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Add New Recipient
        </Button>
      </div>

      {/* Add Recipient Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Recipient</DialogTitle>
          </DialogHeader>
          <RecipientForm
            onSubmit={handleAddRecipient}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Recipient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Recipient</DialogTitle>
          </DialogHeader>
          {editingRecipient && (
            <RecipientForm
              recipient={editingRecipient}
              onSubmit={handleUpdateRecipient}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recipient? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Recipients;
