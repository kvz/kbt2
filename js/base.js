var installationInstructions = document.querySelector("#installation-instructions");
if (installationInstructions) {
    installationInstructions.style.display = "none";
}

// Install app
if (navigator.mozApps) {
    var checkIfInstalled = navigator.mozApps.getSelf();
    checkIfInstalled.onsuccess = function () {
        if (checkIfInstalled.result) {
            // Already installed, try update
            console.log("Checking for update");

            checkIfInstalled.checkForUpdate();

            window.addEventListener('load', function(e) {
              if (window.applicationCache) {
                window.applicationCache.addEventListener('updateready', function(e) {
                    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                      // Browser downloaded a new app cache.
                      // Swap it in and reload the page to get the new hotness.
                      window.applicationCache.swapCache();
                      if (confirm('A new version of this site is available. Load it?')) {
                        window.location.reload();
                      }
                    } else {
                      // Manifest didn't changed. Nothing new to server.
                    }
                }, false);
              }
            }, false);
        } else {



            // Install
            var install = document.querySelector("#install"),
                manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";
            install.className = "show-install";
            install.onclick = function () {
                var installApp = navigator.mozApps.install(manifestURL);
                installApp.onsuccess = function(data) {
                    install.style.display = "none";
                };
                installApp.onerror = function() {
                    alert("Install failed\n\n:" + installApp.error.name);
                };
            };
        }
    };
}
else {
    installationInstructions.style.display = "none";
    console.log("Open Web Apps not supported");
}

// Reload content
var reload = document.querySelector("#reload");
if (reload) {
    reload.onclick = function () {
        location.reload(true);
    };
}
