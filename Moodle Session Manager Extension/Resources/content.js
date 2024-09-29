chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "reloadPage") {
        console.log("Reloading page...");
        location.reload();  // Reload the current page
    }
});
