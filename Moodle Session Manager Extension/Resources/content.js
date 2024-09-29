// browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
//     console.log("Received response: ", response);
// });

// browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log("Received request: ", request);
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "reloadPage") {
        console.log("Reloading page...");
        location.reload();  // Reload the current page
    }
});
