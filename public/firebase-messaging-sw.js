
importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-messaging.js');


// firebase.initializeApp({

//     messagingSenderId: "262598048193",
// })




var config = {
  apiKey: "AIzaSyDstl21Iann4t-odVPIMFTXpI5ToD1jIC0",
  authDomain: "totally-not-spotify.firebaseapp.com",
  databaseURL: "https://totally-not-spotify.firebaseio.com",
  projectId: "totally-not-spotify",
  storageBucket: "totally-not-spotify.appspot.com",
  messagingSenderId: "262598048193",
  appId: "1:262598048193:web:8eb027331acfe77f625740",
  measurementId: "G-YDVW3R60NT"
};
firebase.initializeApp(config);
//const initMessaging=firebase.messaging()
const messaging = firebase.messaging();


// Add the public key generated from the console here.
messaging.usePublicVapidKey("BKWMGFcg3yIaZ8ONAeIORVydRfg1GFtMnKcCPV-jFyEXWAlbLv8nv9Wtsr4Gu5NsVHZTFl4yD0ZXcZpqsBvrIj8");
messaging.requestPermission()
  .then (function(){
    console.log("Have permission");
    return messaging.getToken();
  })
  .then(function(token){
  console.log("token is "); 
  updateUIForPushEnabled(token);
  sendSubscriptionToServer(token);
  console.log(token);
         axios.put("https://totallynotspotify.codes/api/me/notifications/token",
          {
            "token":token,
            "type":"web"
            },
             {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then(res => {
            console.log(res)
         if(res.status===204){
            console.log("Request Succesful and token is ", token)
        }
      })
      .catch(res => {
        console.log(res)
      })
  })
.catch(function(err){
  console.log("error occured")
})
messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  // ...
});


messaging.usePublicVapidKey("BKWMGFcg3yIaZ8ONAeIORVydRfg1GFtMnKcCPV-jFyEXWAlbLv8nv9Wtsr4Gu5NsVHZTFl4yD0ZXcZpqsBvrIj8");
// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(() => {
    messaging.getToken().then((refreshedToken) => {
      console.log('Token refreshed.');
      // Indicate that the new Instance ID token has not yet been sent to the
      try {
        const res = axios.put(this.context.baseURL + "me/notifications/token",
        {
          "token":token
          },
           {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
       if(res.status===204){
          console.log("Request Succesful and token is ", token)
      }
      } 
      catch (err) {
        console.log(err);
      }
      // ...
    }).catch((err) => {
      console.log('Unable to retrieve refreshed token ', err);
      showToken('Unable to retrieve refreshed token ', err);
    });
  });

self.addEventListener('notificationclick', (event) => {
    if (event.action) {
        clients.openWindow(event.action);
    }
    event.notification.close();
}); 

// register service worker & handle push events
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            updateViaCache: 'none'
        });
        messaging.useServiceWorker(registration);
        messaging.onMessage((payload) => {
            const title = payload.notification.title;
            const options = {
                body: payload.notification.body,
                icon: payload.notification.icon,
                actions: [
                    {
                        action: payload.fcmOptions.link,
                    }
                ]
            };
            registration.showNotification(title, options);           
        });
    });
}
self.addEventListener('push', async function(event) {
  event.waitUntil(
      self.registration.showNotification('title', {
        body: 'body'
      })
  );
});