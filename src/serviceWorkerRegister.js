// Service Worker Registration Utility

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration)

          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60000) // Check every minute

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is ready, notify the user
                console.log('New version of the app is available!')
                // You can show a notification here
              }
            })
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    })
  } else {
    console.log('Service Workers are not supported in this browser')
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister()
      }
    })
  }
}
