
/**
 * Transaction PIN status interface
 */
export interface PinStatus {
  isSet: boolean;
  isLocked: boolean;
  remainingAttempts: number;
  lockoutTimeRemaining: number | null;
}
