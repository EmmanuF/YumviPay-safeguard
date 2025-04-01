
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Search, Flag, Plus } from 'lucide-react';

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

const FeatureFlags: React.FC = () => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingFlags, setUpdatingFlags] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  const fetchFeatureFlags = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setFeatureFlags(data || []);
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      toast({
        title: "Error",
        description: "Failed to load feature flags",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatureFlag = async (id: string, enabled: boolean) => {
    setUpdatingFlags(prev => ({ ...prev, [id]: true }));
    
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({ enabled, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setFeatureFlags(featureFlags.map(flag => 
        flag.id === id ? { ...flag, enabled } : flag
      ));
      
      toast({
        title: "Feature flag updated",
        description: `${enabled ? 'Enabled' : 'Disabled'} feature flag successfully.`,
      });
    } catch (error) {
      console.error('Error updating feature flag:', error);
      toast({
        title: "Error",
        description: "Failed to update feature flag",
        variant: "destructive",
      });
    } finally {
      setUpdatingFlags(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const filteredFlags = featureFlags.filter(flag => {
    return (
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (flag.description && flag.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feature Flags</h1>
          <p className="text-muted-foreground">
            Enable or disable features across the application
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Feature Flag
        </Button>
      </div>
      
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search feature flags..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Key</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px] text-center">Status</TableHead>
              <TableHead className="w-[120px]">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    <span>Loading feature flags...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredFlags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  <Flag className="h-10 w-10 mx-auto mb-2" />
                  <p>No feature flags found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredFlags.map((flag) => (
                <TableRow key={flag.id}>
                  <TableCell className="font-mono text-sm">{flag.key}</TableCell>
                  <TableCell className="font-medium">{flag.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {flag.description || 'No description provided'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      {updatingFlags[flag.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Switch
                          checked={flag.enabled}
                          onCheckedChange={(checked) => toggleFeatureFlag(flag.id, checked)}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(flag.updated_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FeatureFlags;
