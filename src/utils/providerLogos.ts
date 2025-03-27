
/**
 * Creates a data URL for a provider logo when the image fails to load
 * @param providerId The ID of the provider
 * @returns A data URL containing a simple logo
 */
export const generateProviderLogo = (providerId: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 60;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // MTN yellow background
  if (providerId.includes('mtn')) {
    ctx.fillStyle = '#FFCC00';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MTN', canvas.width/2, canvas.height/2);
  } 
  // Orange brand color
  else if (providerId.includes('orange')) {
    ctx.fillStyle = '#FF6600';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Orange', canvas.width/2, canvas.height/2);
  }
  // Generic fallback
  else {
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(providerId.replace(/_/g, ' '), canvas.width/2, canvas.height/2);
  }
  
  return canvas.toDataURL('image/png');
};

/**
 * Returns the appropriate logo path or generates a fallback
 * @param providerId The ID of the provider
 * @returns Either a path to the logo image or a generated data URL
 */
export const getProviderLogoSrc = (providerId: string): string => {
  if (providerId.includes('mtn')) {
    return '/assets/providers/mtn-logo.png';
  } else if (providerId.includes('orange')) {
    return '/assets/providers/orange-logo.png';
  }
  
  // If no specific path, generate one
  return generateProviderLogo(providerId);
};
