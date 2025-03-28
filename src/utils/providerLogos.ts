
/**
 * Creates a data URL for a provider logo with improved styling
 * @param providerId The ID of the provider
 * @returns A data URL containing a styled logo
 */
export const generateProviderLogo = (providerId: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // MTN yellow background
  if (providerId.includes('mtn')) {
    // Create a gradient background for MTN
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FFCC00');
    gradient.addColorStop(1, '#F7BC00');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add company name in black
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 64px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MTN', canvas.width/2, canvas.height/2);
    
    // Add subtle pattern
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = '#000000';
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.fillRect(i, 0, 2, canvas.height);
    }
    ctx.globalAlpha = 1;
  } 
  // Orange brand color
  else if (providerId.includes('orange')) {
    // Create a gradient background for Orange
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FF6600');
    gradient.addColorStop(1, '#F05800');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add company name in white
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Orange', canvas.width/2, canvas.height/2);
    
    // Add subtle pattern
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.fillRect(i, 0, 2, canvas.height);
    }
    ctx.globalAlpha = 1;
  }
  // Generic fallback
  else {
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const displayName = providerId.replace(/_/g, ' ').replace(/-/g, ' ');
    ctx.fillText(displayName, canvas.width/2, canvas.height/2);
  }
  
  // Add rounded corners by creating a rounded rectangle mask
  return canvas.toDataURL('image/png');
};

/**
 * Returns the appropriate logo path or generates a fallback 
 * @param providerId The ID of the provider
 * @returns A generated data URL with the provider logo
 */
export const getProviderLogoSrc = (providerId: string): string => {
  // Generate logos to avoid image loading issues
  return generateProviderLogo(providerId);
};
