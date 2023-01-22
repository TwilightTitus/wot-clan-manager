if ('serviceWorker' in navigator) {
    navigator
        .serviceWorker
        .register('./serviceworker.js', {scope: './'})
        .then((reg) => {
            if (reg.installing) {
                console.log('Service worker installing');
            } else if (reg.waiting) {
                console.log('Service worker installed');
            } else if (reg.active) {
                console.log('Service worker active');
            }
        })
        .catch((error) => {
        // Registration failed
            console.log('Registration failed with ' + error); 
        });

    // Communicate with the service worker using MessageChannel API.
    function sendMessage(message) {
        return new Promise((resolve, reject) => {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = function (event) {
                resolve(`Direct message from SW: ${event.data}`);
            };
            navigator
                .serviceWorker
                .controller
                .postMessage(message, [messageChannel.port2])
        });
    }
}