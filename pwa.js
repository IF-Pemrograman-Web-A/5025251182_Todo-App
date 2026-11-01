if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker.register("./sw.js")
            .then(function(registration) {
                console.log(
                    "Service Worker registered:",
                    registration.scope
                );
            })
            .catch(function(error) {
                console.error(
                    "Service Worker registration failed:",
                    error
                );
            });
    });
}

let deferredPrompt;

const installButton = document.getElementById("installButton");

window.addEventListener("beforeinstallprompt", function(event) {
    event.preventDefault();

    deferredPrompt = event;
    installButton.hidden = false;
});

installButton.addEventListener("click", async function() {
    if (!deferredPrompt) {
        return;
    }

    deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    console.log("Install result:", result.outcome);

    deferredPrompt = null;
    installButton.hidden = true;
});

window.addEventListener("appinstalled", function() {
    installButton.hidden = true;
    console.log("Study Planner installed");
});