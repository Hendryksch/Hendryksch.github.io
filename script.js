if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('Service Worker registriert mit Scope:', registration.scope);

            registration.onupdatefound = function() {
                const installingWorker = registration.installing;
                installingWorker.onstatechange = function() {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // Neuer Service Worker gefunden
                            showUpdateButton();
                        } else {
                            console.log('Content is cached for offline use.');
                        }
                    }
                };
            };
        }, function(error) {
            console.log('Service Worker Registrierung fehlgeschlagen:', error);
        });
    });
}

function showUpdateButton() {
    const updateButton = document.getElementById('updateButton');
    updateButton.style.display = 'block';

    updateButton.addEventListener('click', function() {
        if (confirm('Ein Update ist verfügbar. Möchten Sie jetzt aktualisieren?')) {
            window.location.reload();
        }
    });
}