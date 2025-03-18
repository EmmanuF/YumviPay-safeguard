
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface GeneralSettingsFormData {
  siteName: string;
  contactEmail: string;
  supportPhone: string;
  timezone: string;
}

export const useGeneralSettings = () => {
  const { toast } = useToast();
  const form = useForm<GeneralSettingsFormData>({
    defaultValues: {
      siteName: 'Yumvi-Pay Admin',
      contactEmail: 'admin@yumvipay.com',
      supportPhone: '+1 (555) 123-4567',
      timezone: 'UTC'
    }
  });

  const handleSubmit = (data: GeneralSettingsFormData) => {
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
    });
    console.log('General settings updated:', data);
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
};
