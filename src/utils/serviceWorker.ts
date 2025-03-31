
/**
 * Register the service worker for offline capability
 */
export const registerServiceWorker = async (): Promise<{
  success: boolean;
  error?: Error;
}> => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers are not supported in this browser');
    return { success: false };
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    if (registration.installing) {
      console.log('Service worker installing');
    } else if (registration.waiting) {
      console.log('Service worker installed but waiting');
    } else if (registration.active) {
      console.log('Service worker active');
    }

    // Handle service worker updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New service worker available, refresh to update');
          }
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error registering service worker:', error);
    return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

/**
 * Unregister all service workers
 */
export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error unregistering service worker:', error);
    return false;
  }
};

/**
 * Check if the app is installed (PWA mode)
 */
export const isAppInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         // @ts-ignore - This is a non-standard property
         window.navigator.standalone === true;
};

/**
 * Update the service worker immediately
 */
export const updateServiceWorker = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating service worker:', error);
    return false;
  }
};
