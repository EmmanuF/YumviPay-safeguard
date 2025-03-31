
// Service Worker for Yumvi-Pay
const CACHE_NAME = 'yumvi-pay-cache-v1';

// Assets to cache initially
const INITIAL_CACHED_RESOURCES = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/site.webmanifest',
  '/assets/providers/mtn-logo.png',
  '/assets/providers/orange-logo.png'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service worker installing and caching initial resources');
        return cache.addAll(INITIAL_CACHED_RESOURCES);
      })
      .catch(error => {
        console.error('Error during service worker installation:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service worker cleaning old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Ensure the service worker takes control immediately
  return self.clients.claim();
});

// Helper to determine if a request is an API call
const isApiRequest = (url) => {
  return url.includes('/api/') || 
    url.includes('randomuser.me') || 
    url.includes('flagcdn.com');
};

// Helper to determine if request is for an image
const isImageRequest = (url) => {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'];
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext)) || 
         url.includes('lovable-uploads');
};

// Helper to determine if a request should be cached
const shouldCache = (url) => {
  // Don't cache API requests or authentication endpoints
  if (isApiRequest(url)) {
    return false;
  }
  
  // Special handling for navigation requests (HTML)
  if (url.endsWith('/') || url.endsWith('.html')) {
    return true;
  }
  
  // Cache static assets
  const staticExtensions = [
    '.js', '.css', '.woff', '.woff2', '.ttf', '.json', '.ico'
  ];
  
  const shouldCacheStatic = staticExtensions.some(ext => 
    url.toLowerCase().endsWith(ext)
  );
  
  return shouldCacheStatic || isImageRequest(url);
};

// Network-first strategy for API and dynamic content
const networkFirstStrategy = async (request) => {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful and it's a GET request, store in cache
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If nothing in cache either, return a fallback or error
    console.error('Network and cache both failed for:', request.url);
    throw error;
  }
};

// Cache-first strategy for static assets
const cacheFirstStrategy = async (request) => {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, get from network
  try {
    const networkResponse = await fetch(request);
    
    // Store in cache if it's a successful GET request
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Network request failed for:', request.url);
    throw error;
  }
};

// Fetch event - respond with cached resources or fetch from network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !isImageRequest(event.request.url)) {
    return;
  }
  
  // Special handling for API requests
  if (isApiRequest(event.request.url)) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // For requests we want to cache
  if (shouldCache(event.request.url)) {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }
  
  // Default to network for everything else
  event.respondWith(fetch(event.request));
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const notification = event.data.json();
    
    self.registration.showNotification('Yumvi-Pay', {
      body: notification.body || 'You have a new notification',
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: notification.data || {},
      actions: notification.actions || []
    });
  } catch (error) {
    // If JSON parsing fails, use text
    const message = event.data.text();
    
    self.registration.showNotification('Yumvi-Pay', {
      body: message || 'You have a new notification',
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png'
    });
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Focus on or open a window
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        const url = event.notification.data?.url || '/';
        return clients.openWindow(url);
      }
    })
  );
});
