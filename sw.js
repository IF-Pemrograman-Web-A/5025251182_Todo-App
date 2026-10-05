self.addEventListener(
    "install",
    function() {
        console.log("Service Worker installed");
    }
);

self.addEventListener(
    "activate",
    function() {
        console.log("Service Worker activated");
    }
);

self.addEventListener(
    "message",
    function(event) {
        if (event.data && event.data.type === "show-notification"
        ) {
            self.registration.showNotification(
                event.data.title,
                {
                    body: event.data.body
                }
            );
        }
    }
);

self.addEventListener(
    "notificationclick",
    function(event) {
        event.notification.close();
        event.waitUntil(
            clients.openWindow("/")
        );
    }
);