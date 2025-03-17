
import { supabase } from '@/integrations/supabase/client';
import { isOffline, addPausedRequest } from '@/utils/networkUtils';

export interface RecurringPayment {
  id: string;
  recipientId: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  provider: string;
  frequency: string;
  startDate: Date;
  nextDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastTransactionId?: string;
}

// Helper function to calculate the next payment date
const calculateNextDate = (startDate: Date, frequency: string): Date => {
  const result = new Date(startDate);
  
  switch (frequency) {
    case 'weekly':
      result.setDate(result.getDate() + 7);
      break;
    case 'biweekly':
      result.setDate(result.getDate() + 14);
      break;
    case 'monthly':
      result.setMonth(result.getMonth() + 1);
      break;
    case 'quarterly':
      result.setMonth(result.getMonth() + 3);
      break;
    default:
      result.setMonth(result.getMonth() + 1); // Default to monthly
  }
  
  return result;
};

// Create a new recurring payment
export const createRecurringPayment = async (
  recipientId: string,
  amount: string,
  currency: string,
  paymentMethod: string,
  provider: string,
  frequency: string
): Promise<RecurringPayment | null> => {
  try {
    // Get the current user's ID
    const { data: authData } = await supabase.auth.getSession();
    const userId = authData.session?.user.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Calculate the next date based on frequency
    const startDate = new Date();
    const nextDate = calculateNextDate(startDate, frequency);
    
    const { data, error } = await supabase
      .from('recurring_payments')
      .insert({
        user_id: userId,
        recipient_id: recipientId,
        amount,
        currency,
        payment_method: paymentMethod,
        provider,
        frequency,
        start_date: startDate.toISOString(),
        next_date: nextDate.toISOString(),
        is_active: true
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating recurring payment:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      recipientId: data.recipient_id,
      amount: data.amount,
      currency: data.currency,
      paymentMethod: data.payment_method,
      provider: data.provider,
      frequency: data.frequency,
      startDate: new Date(data.start_date),
      nextDate: new Date(data.next_date),
      endDate: data.end_date ? new Date(data.end_date) : undefined,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      lastTransactionId: data.last_transaction_id
    };
  } catch (error) {
    if (isOffline()) {
      // Queue the request for when the connection is restored
      addPausedRequest(() => createRecurringPayment(
        recipientId, amount, currency, paymentMethod, provider, frequency
      ));
      
      // Return a temporary object with the basic info
      return {
        id: `temp_${Date.now()}`,
        recipientId,
        amount,
        currency,
        paymentMethod,
        provider,
        frequency,
        startDate: new Date(),
        nextDate: calculateNextDate(new Date(), frequency),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    
    console.error('Error creating recurring payment:', error);
    throw error;
  }
};

// Get all recurring payments for the current user
export const getRecurringPayments = async (): Promise<RecurringPayment[]> => {
  try {
    // Get the current user's ID
    const { data: authData } = await supabase.auth.getSession();
    const userId = authData.session?.user.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('recurring_payments')
      .select('*')
      .eq('user_id', userId)
      .order('next_date', { ascending: true });
      
    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.id,
      recipientId: item.recipient_id,
      amount: item.amount,
      currency: item.currency,
      paymentMethod: item.payment_method,
      provider: item.provider,
      frequency: item.frequency,
      startDate: new Date(item.start_date),
      nextDate: new Date(item.next_date),
      endDate: item.end_date ? new Date(item.end_date) : undefined,
      isActive: item.is_active,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      lastTransactionId: item.last_transaction_id
    }));
  } catch (error) {
    console.error('Error fetching recurring payments:', error);
    return [];
  }
};

// Update a recurring payment
export const updateRecurringPayment = async (
  id: string,
  updates: Partial<RecurringPayment>
): Promise<RecurringPayment | null> => {
  try {
    const updateData: any = {};
    
    if (updates.amount) updateData.amount = updates.amount;
    if (updates.currency) updateData.currency = updates.currency;
    if (updates.paymentMethod) updateData.payment_method = updates.paymentMethod;
    if (updates.provider) updateData.provider = updates.provider;
    if (updates.frequency) {
      updateData.frequency = updates.frequency;
      // Recalculate next date if frequency changes
      if (updates.startDate) {
        updateData.next_date = calculateNextDate(updates.startDate, updates.frequency).toISOString();
      }
    }
    if (updates.startDate) updateData.start_date = updates.startDate.toISOString();
    if (updates.nextDate) updateData.next_date = updates.nextDate.toISOString();
    if (updates.endDate) updateData.end_date = updates.endDate.toISOString();
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    if (updates.lastTransactionId) updateData.last_transaction_id = updates.lastTransactionId;
    
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('recurring_payments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      recipientId: data.recipient_id,
      amount: data.amount,
      currency: data.currency,
      paymentMethod: data.payment_method,
      provider: data.provider,
      frequency: data.frequency,
      startDate: new Date(data.start_date),
      nextDate: new Date(data.next_date),
      endDate: data.end_date ? new Date(data.end_date) : undefined,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      lastTransactionId: data.last_transaction_id
    };
  } catch (error) {
    console.error('Error updating recurring payment:', error);
    throw error;
  }
};

// Cancel a recurring payment
export const cancelRecurringPayment = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('recurring_payments')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error canceling recurring payment:', error);
    return false;
  }
};
