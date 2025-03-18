
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, 
} from "@/components/ui/form";
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, PlusCircle } from 'lucide-react';
import { getAdminCountries, updateCountrySettings, addNewCountry } from '@/services/admin/adminCountryService';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';

const AdminCountries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      code: '',
      name: '',
      currency: '',
      currency_symbol: '',
      flag_emoji: '',
    }
  });
  
  const { 
    data: countries = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['adminCountries'],
    queryFn: getAdminCountries,
  });
  
  // Filter countries based on search term
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleToggleSending = async (code: string, currentValue: boolean) => {
    try {
      const success = await updateCountrySettings(code, {
        is_sending_enabled: !currentValue
      });
      
      if (success) {
        toast({
          title: "Setting Updated",
          description: `Sending ${!currentValue ? 'enabled' : 'disabled'} for ${code}`,
        });
        
        refetch();
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update country settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating country settings",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleReceiving = async (code: string, currentValue: boolean) => {
    try {
      const success = await updateCountrySettings(code, {
        is_receiving_enabled: !currentValue
      });
      
      if (success) {
        toast({
          title: "Setting Updated",
          description: `Receiving ${!currentValue ? 'enabled' : 'disabled'} for ${code}`,
        });
        
        refetch();
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update country settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating country settings",
        variant: "destructive",
      });
    }
  };
  
  const onSubmitNewCountry = async (data: any) => {
    try {
      const newCountry = {
        ...data,
        is_sending_enabled: false,
        is_receiving_enabled: false,
        payment_methods: []
      };
      
      const success = await addNewCountry(newCountry);
      
      if (success) {
        toast({
          title: "Country Added",
          description: `${data.name} has been added successfully`,
        });
        
        setIsAddDialogOpen(false);
        form.reset();
        refetch();
      } else {
        toast({
          title: "Failed to Add Country",
          description: "There was an error adding the country",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the country",
        variant: "destructive",
      });
    }
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Countries Management</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search countries..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Country
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Country</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new country
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitNewCountry)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country Code</FormLabel>
                          <FormControl>
                            <Input placeholder="US" {...field} />
                          </FormControl>
                          <FormDescription>
                            2-letter ISO country code
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country Name</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency Code</FormLabel>
                          <FormControl>
                            <Input placeholder="USD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currency_symbol"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency Symbol</FormLabel>
                          <FormControl>
                            <Input placeholder="$" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="flag_emoji"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Flag Emoji</FormLabel>
                          <FormControl>
                            <Input placeholder="🇺🇸" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Add Country</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Countries</CardTitle>
            <CardDescription>
              Manage supported countries and their payment methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredCountries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No countries found matching your search criteria
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Flag</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Sending</TableHead>
                    <TableHead>Receiving</TableHead>
                    <TableHead>Payment Methods</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCountries.map((country) => (
                    <TableRow key={country.code}>
                      <TableCell className="font-medium">{country.code}</TableCell>
                      <TableCell>{country.flag_emoji || '🌐'}</TableCell>
                      <TableCell>{country.name}</TableCell>
                      <TableCell>
                        {country.currency_symbol} {country.currency}
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={country.is_sending_enabled} 
                          onCheckedChange={() => handleToggleSending(country.code, country.is_sending_enabled)}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={country.is_receiving_enabled} 
                          onCheckedChange={() => handleToggleReceiving(country.code, country.is_receiving_enabled)}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge>
                          {country.payment_methods?.length || 0} methods
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          onClick={() => toast({
                            title: "Not Implemented",
                            description: "Country details editing not implemented yet"
                          })}
                        >
                          Edit
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

export default AdminCountries;
