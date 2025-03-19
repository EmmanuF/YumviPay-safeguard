
import { DateRange } from "react-day-picker";

export interface Promotion {
  id: number;
  name: string;
  code: string;
  discount: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number;
  minAmount: string;
  isFirstTimeOnly: boolean;
}

export interface NewPromotion {
  name: string;
  code: string;
  discount: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit: number;
  minAmount: string;
  isFirstTimeOnly: boolean;
}

export interface PromotionFormProps {
  newPromotion: NewPromotion;
  setNewPromotion: React.Dispatch<React.SetStateAction<NewPromotion>>;
  handleAddPromotion: () => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  startDateRange: DateRange | undefined;
  setStartDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  endDateRange: DateRange | undefined;
  setEndDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  handleStartDateChange: (range: DateRange | undefined) => void;
  handleEndDateChange: (range: DateRange | undefined) => void;
}
