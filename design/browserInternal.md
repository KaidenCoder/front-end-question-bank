## Service worker
- A service worker is a background javascript process that runs in the browser separate from the main UI thread
- It acts like a network proxy between the browser and the server

Browser Page
     |
Service Worker
     |
Network / Server

Because of this, it can
* intercepts network requests
* cache files
* serve responses faster
* work offline
* reduce server calls
This makes applications very fast, even without frameworks

## Where Service Worker Runs (Browser Internals)
Inside the browser acritecture:
JS Engine (V8)
     |
Main Thread (UI Rendering)
     |
Event Loop
     |
Service Worker Thread
     |
Cache Storage
     |
Network

Important characteristics:
* Runs in a separate thread
* No access to DOM
* Works via events

## Service Worker Lifecycle
A service worker goes through 3 main phases
1) Register
The webpage registers the service worker.
```
Javascript
if('service' in navigator){
    navigator.serviceWorker.register('/sw.js')
}
```
2) Install
Runs once when the service worker is installed.
Used to cache important assets.
```
Javascript
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("v1").then(cache => {
            return cache.addAll([
                "/",
                "/index.html",
                "/styles.css",
                "/app.js"
            ])
        })
    )
})
```
Now these files are stored locally in browser cache

3) Fetch
Intercepts network requests
```
Javascript
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request)
        })
    )
})
```
Flow:
```
User Request
     |
Service Worker intercepts
     |
Check Cache
     |       \  
Cache Hit    Cache Miss
     |            |
Return fast    Fetch from server
```
This makes the website very fast

## How this optimizes without React
Frameworks like React optimize UI rendering
Service workers optimize network performance
So even plain Javascript websites become fast
Example:
Without Service Worker:
```
User loads page:
- browser requests CSS
- requests JS
- requests images
- requests API
- slow loading
```
With Service Worker:
```
First visit
- assets cached
Second visit
- assets loaded from cache
- almost instant
```
This is a huge optimization

## Advanced Optimisation Techniques
1) Cache First Strategy
Used for static assets
 Cache -> Network
Example:
 CSS
 JS
 Fonts
 Images
2) Network First Strategy
Used for APIs.
 Network -> Cache fallback
Example:
 news API
 user profile
 dashboard data
3) Stale While Revalidate
Fastest modern strategy
 ```
  Return cache immediately
  Update cache in background
 ```
Flow
```
User request
 -> return cached data instantly
 -> fetch new data
 -> update cache  
```
Used by Google PWAs

## Offline Capability
Service workers enable offline apps
Example:
```
  User opens website
  Service worker caches assets

  Internet lost

  User loads
  -> site still loads from cache
```
This is how PWA work
