
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Recipient } from '@/types/recipient';
import { useRecipients } from '@/hooks/useRecipients';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/BottomNavigation';
import { Contact } from '@/services/contacts';
import PageTransition from '@/components/PageTransition';
import { 
  RecipientsList, 
  SearchSortToolbar, 
  RecipientDialogs, 
  ContactImporter 
} from '@/components/recipients';
import { sortRecipients, filterRecipients, SortOption } from '@/utils/recipientUtils';

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
  const [sortOption, setSortOption] = useState<SortOption>('recent');

  // Apply filtering and sorting
  const filteredRecipients = sortRecipients(
    filterRecipients(recipients, searchQuery, activeTab),
    sortOption
  );

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

  const handleImportContacts = async (contacts: Pick<Contact, 'name' | 'phoneNumber' | 'email'>[]) => {
    if (!contacts.length) return;

    let importCount = 0;
    for (const contact of contacts) {
      if (contact.name && (contact.phoneNumber || contact.email)) {
        try {
          await addRecipient({
            name: contact.name,
            contact: contact.phoneNumber || contact.email || '',
            country: 'Cameroon', // Default country for MVP
            isFavorite: false,
          });
          importCount++;
        } catch (error) {
          console.error('Error importing contact:', error);
        }
      }
    }

    toast({
      title: "Contacts Imported",
      description: `Successfully imported ${importCount} contacts`,
    });
  };

  return (
    <PageTransition>
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
          
          <SearchSortToolbar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />

          <div className="mb-4">
            <ContactImporter onImport={handleImportContacts} />
          </div>

          <div className="space-y-3 mb-20">
            <TabsContent value={activeTab} className="mt-0">
              <RecipientsList 
                recipients={filteredRecipients}
                loading={loading}
                searchQuery={searchQuery}
                activeTab={activeTab}
                onSelectRecipient={handleSelectRecipient}
                onEditRecipient={handleEditRecipient}
                onDeleteRecipient={handleDeleteRecipient}
                onToggleFavorite={toggleFavorite}
              />
            </TabsContent>
          </div>
        </div>

        <div className="fixed bottom-20 left-0 right-0 px-4 z-10">
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            className="w-full shadow-lg"
            size="lg"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Add New Recipient
          </Button>
        </div>

        <BottomNavigation />

        <RecipientDialogs
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          editingRecipient={editingRecipient}
          onAddRecipient={handleAddRecipient}
          onUpdateRecipient={handleUpdateRecipient}
          onDeleteConfirm={handleDeleteConfirm}
        />
      </div>
    </PageTransition>
  );
};

export default Recipients;
