
/**
 * Check if the app is running on a specific platform
 * @param platform 'capacitor' | 'web' | 'ios' | 'android'
 * @returns boolean
 */
export function isPlatform(platform: 'capacitor' | 'web' | 'ios' | 'android'): boolean {
  // Simple implementation - in a real app this would detect the actual platform
  if (platform === 'web') {
    return true;
  }
  
  // For now, we'll return false for capacitor/native platforms
  // In a real app, we would use Capacitor's Platform API
  return false;
}
