# PWA Setup Guide for Offline Chess

This document explains how the Progressive Web App (PWA) features have been implemented in the Offline Chess app.

## Files Created/Modified

### 1. **public/service-worker.js**
The Service Worker handles offline functionality:
- **Install Event**: Caches essential app files when the service worker is first installed
- **Activate Event**: Cleans up old cache versions
- **Fetch Event**: Intercepts network requests and serves cached content when offline
- **Fallback**: Returns a message when offline and no cache is available

### 2. **public/manifest.json**
The Web App Manifest defines PWA metadata:
- **App Information**: Name, description, and icons
- **Display Mode**: `standalone` - runs like a native app
- **Theme Colors**: Dark background with blue accent
- **Icons**: Multiple sizes for different devices (192x192, 512x512)
- **Screenshots**: For app store listings
- **Shortcuts**: Quick actions (e.g., "New Game")

### 3. **index.html** (Updated)
Added PWA-specific meta tags:
```html
<meta name="theme-color" content="#4299e1">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Chess">
<link rel="manifest" href="/manifest.json">
<link rel="icon" type="image/svg+xml" href="...">
<link rel="apple-touch-icon" href="...">
```

### 4. **src/serviceWorkerRegister.js** (New)
Utility functions for Service Worker management:
- `registerServiceWorker()`: Registers the service worker on app load
- `unregisterServiceWorker()`: Removes the service worker if needed
- Includes automatic update checking every minute

### 5. **src/main.jsx** (Updated)
Calls `registerServiceWorker()` on app initialization to enable offline support.

## How It Works

### Installation Flow
1. User visits the app in a supported browser
2. `main.jsx` calls `registerServiceWorker()`
3. Service Worker is registered and installed
4. App files are cached for offline use

### Offline Access
1. User can continue playing even without internet
2. Service Worker intercepts fetch requests
3. Cached files are served from cache
4. Game state is preserved in localStorage

### Updates
1. Service Worker checks for updates every minute
2. New version is downloaded in the background
3. User is notified when a new version is available
4. User can refresh to get the latest version

## Installation on Different Platforms

### Android
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home screen"
4. The app will install like a native app

### iOS
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will be added to your home screen

### Desktop (Chrome/Edge)
1. Open the app in Chrome or Edge
2. Click the install icon in the address bar
3. Select "Install"
4. The app will open in a standalone window

## Testing Offline Mode

### Using Chrome DevTools
1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Check "Offline" checkbox
4. Refresh the page
5. The app should work without internet

### Using Network Throttling
1. Open DevTools (F12)
2. Go to Network tab
3. Change throttling to "Offline"
4. The app should continue to work

## Caching Strategy

The Service Worker uses a **Cache First, Network Fallback** strategy:
1. Check if the requested resource is in cache
2. If found, serve from cache
3. If not found, fetch from network
4. Cache the new response for future use
5. If network fails, show offline message

## Updating Cache

To update the cache version:
1. Edit `CACHE_NAME` in `public/service-worker.js`
2. Change from `'offline-chess-v1'` to `'offline-chess-v2'`, etc.
3. Deploy the new version
4. Old caches will be automatically cleaned up

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | All PWA features supported |
| Firefox | ✅ Full | All PWA features supported |
| Safari | ⚠️ Partial | Service Workers not supported, but can be added to home screen |
| Edge | ✅ Full | All PWA features supported |
| IE 11 | ❌ None | Not supported |

## Security Considerations

- Service Workers only work over HTTPS (or localhost for development)
- Cached data is stored locally and never sent to servers
- Game state is stored in browser's localStorage
- No personal data is collected or transmitted

## Troubleshooting

### Service Worker not registering
- Check browser console for errors
- Ensure app is served over HTTPS
- Clear browser cache and try again

### App not working offline
- Check if Service Worker is registered (DevTools → Application → Service Workers)
- Verify cache contents (DevTools → Application → Cache Storage)
- Check browser console for errors

### Updates not appearing
- Service Worker checks for updates every minute
- Manual refresh may be needed to see new version
- Try clearing cache and reloading

## Next Steps

1. Test the app offline using Chrome DevTools
2. Install the app on your mobile device
3. Verify offline functionality
4. Share with users and gather feedback
