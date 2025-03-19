
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface AppearanceSettingsFormData {
  theme: string;
  accentColor: string;
  enableAnimations: boolean;
  sidebarCollapsed: boolean;
}

export const useAppearanceSettings = () => {
  const { toast } = useToast();
  const form = useForm<AppearanceSettingsFormData>({
    defaultValues: {
      theme: 'light',
      accentColor: 'crimson', // Using crimson to match our new theme
      enableAnimations: true,
      sidebarCollapsed: false
    }
  });

  const handleSubmit = (data: AppearanceSettingsFormData) => {
    toast({
      title: "Appearance Updated",
      description: "Your appearance settings have been saved.",
    });
    console.log('Appearance settings updated:', data);
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
};
