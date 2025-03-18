
import { Json } from "@/integrations/supabase/types";

export interface AdminCountry {
  code: string;
  name: string;
  currency: string;
  currency_symbol: string;
  flag_emoji: string;
  is_sending_enabled: boolean;
  is_receiving_enabled: boolean;
  payment_methods: any[];
}
