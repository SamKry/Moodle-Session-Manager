chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "reloadPage") {
        location.reload();
    }
});

// Function to check if user is logged in by identifying a specific element
function isUserLoggedIn() {
    let loggenIn = document.querySelector('.userbutton') !== null;
    return loggenIn;
}

function isMoodleSite(url) {
    let isMoodleSite =url.includes("moodle");
    return isMoodleSite;
}

// Trigger the save only if the user is logged in
window.addEventListener("load", function() {
    if (isMoodleSite(window.location.hostname)) {
        if (isUserLoggedIn()) {
            chrome.runtime.sendMessage({ action: "saveCookie" });
        } else {
        }
    }
});

