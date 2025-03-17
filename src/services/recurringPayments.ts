
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/services/auth';
import { formatDate } from '@/utils/formatUtils';

// Function to create a new recurring payment
export const createRecurringPayment = async (
  recipientId: string,
  amount: string,
  currency: string,
  paymentMethod: string,
  provider: string,
  frequency: string = 'monthly'
): Promise<any> => {
  try {
    // Get the current user
    const currentUser = await getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      throw new Error('User not authenticated');
    }
    
    // Calculate the next payment date based on frequency
    const startDate = new Date();
    let nextDate = new Date();
    
    switch (frequency) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'biweekly':
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      default:
        nextDate.setMonth(nextDate.getMonth() + 1); // Default to monthly
    }
    
    // Format dates for database
    const formattedStartDate = formatDate(startDate);
    const formattedNextDate = formatDate(nextDate);
    
    // Create the recurring payment record
    const { data, error } = await supabase
      .from('recurring_payments')
      .insert({
        user_id: currentUser.id,
        recipient_id: recipientId,
        amount: amount,
        currency: currency,
        payment_method: paymentMethod,
        provider: provider,
        frequency: frequency,
        start_date: formattedStartDate,
        next_date: formattedNextDate,
        is_active: true
      });
    
    if (error) {
      console.error('Error creating recurring payment:', error.message);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error: any) {
    console.error('Recurring payment creation failed:', error.message);
    throw new Error(`Failed to create recurring payment: ${error.message}`);
  }
};

// Function to get all active recurring payments for current user
export const getRecurringPayments = async (): Promise<any[]> => {
  try {
    // Get the current user
    const currentUser = await getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('recurring_payments')
      .select('*, recipients(*)')
      .eq('user_id', currentUser.id)
      .eq('is_active', true)
      .order('next_date', { ascending: true });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Failed to fetch recurring payments:', error.message);
    return [];
  }
};

// Function to cancel a recurring payment
export const cancelRecurringPayment = async (id: string): Promise<boolean> => {
  try {
    // Get the current user
    const currentUser = await getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('recurring_payments')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', currentUser.id);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return true;
  } catch (error: any) {
    console.error('Failed to cancel recurring payment:', error.message);
    return false;
  }
};
