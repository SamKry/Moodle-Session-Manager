chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "reloadPage") {
        location.reload();
    }
});

function isUserLoggedIn() {
    return document.querySelector('.userbutton') !== null;
}

function isMoodleSite(url) {
    return url.includes("moodle");
}

window.addEventListener("load", function() {
    if (isMoodleSite(window.location.hostname)) {
        if (isUserLoggedIn()) {
            chrome.runtime.sendMessage({ action: "saveCookie" });
            console.log("User is logged in. Moodle session cookie saved.");
            // Reset the restore flag when the user is logged in
            chrome.storage.local.set({ hasAttemptedRestore: false });
        } else {
            // Retrieve the flag from storage
            chrome.storage.local.get("hasAttemptedRestore", (data) => {
                const hasAttemptedRestore = data.hasAttemptedRestore || false;
                
                // Only attempt to restore if we haven't already tried
                if (!hasAttemptedRestore) {
                    chrome.storage.local.set({ hasAttemptedRestore: true }); // Set the flag in storage
                    chrome.runtime.sendMessage({ action: "restoreCookie" });
                    console.log("User is not logged in. Attempting to restore cookie.");
                } else {
                    console.log("Restore already attempted; skipping.");
                }
            });
        }
    }
});

