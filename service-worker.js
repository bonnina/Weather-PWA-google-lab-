
var cacheName = 'weatherPWA2';
var dataCacheName = 'weatherData';
var filesToCache = [
  '/',
  '/index.html?hs=true',
  '/scripts/app.js',
  '/scripts/localforage.js',
  '/styles/ud811.css',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png'
];

  self.addEventListener('install', function(x) {
	console.log('[ServiceWorker] Install');
	x.waitUntil(
	  caches.open(cacheName)
      .then(function(cache) {
		return cache.addAll(filesToCache);
	  })
      .catch((error) =>  {
         console.error(error);
      })
	);
  });
 
  self.addEventListener('activate', function(y) {
	console.log('[ServiceWorker] Activate');
	y.waitUntil(
	  caches.keys()
	  .then(function(listOfKeys) {
		return Promise.all(listOfKeys.map(function(key) {
		  if(key !== cacheName && key !== dataCacheName) {
			return caches.delete(key);
		  }
		}));
	  })
      .catch((error) =>  {
         console.error(error);
      })
	);
    return self.clients.claim();
  });
  
  self.addEventListener('fetch', function(z) {
	if(z.request.url.startsWith(weatherAPIUrlBase)) {
	  z.respondWith(
	    fetch(z.request)
		.then(function(response) {
		  return caches.open(dataCacheName).then(function(cache) {
			cache.put(z.request.url, response.clone());
		    console.log('[Service Worker] fetched and cached data');
		    return response;
		  });
		})	
	  );
	} else {
	  z.respondWith(
	    caches.match(z.request)
	    .then(function(response) {
		    if(response) {
		      return response;
	  	    } 
		    return fetch(z.request);
	    })
	  );
	}
  });
 
  var weatherAPIUrlBase = 'https://publicdata-weather.firebaseio.com/';
   