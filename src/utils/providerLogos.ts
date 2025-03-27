
/**
 * Creates a data URL for a provider logo when the image fails to load
 * @param providerId The ID of the provider
 * @returns A data URL containing a simple logo
 */
export const generateProviderLogo = (providerId: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 240;  // Increased dimensions for better rectangle shape
  canvas.height = 140;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // MTN yellow background
  if (providerId.includes('mtn')) {
    ctx.fillStyle = '#FFCC00';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 48px Arial';  // Increased font size
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MTN', canvas.width/2, canvas.height/2);
  } 
  // Orange brand color
  else if (providerId.includes('orange')) {
    ctx.fillStyle = '#FF6600';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 42px Arial';  // Increased font size
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Orange', canvas.width/2, canvas.height/2);
  }
  // Generic fallback
  else {
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 32px Arial';  // Increased font size
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const displayName = providerId.replace(/_/g, ' ').replace(/-/g, ' ');
    ctx.fillText(displayName, canvas.width/2, canvas.height/2);
  }
  
  return canvas.toDataURL('image/png');
};

/**
 * Returns the appropriate logo path or generates a fallback 
 * This implementation always returns a generated logo to avoid blinking
 * @param providerId The ID of the provider
 * @returns A generated data URL with the provider logo
 */
export const getProviderLogoSrc = (providerId: string): string => {
  // Always generate logos to avoid blinking with failed image loads
  return generateProviderLogo(providerId);
};
