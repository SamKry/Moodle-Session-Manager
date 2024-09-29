document.getElementById('save').addEventListener('click', () => {
    console.log("Save button clicked.");
    chrome.runtime.sendMessage({ action: "saveCookie" });
});

document.getElementById('restore').addEventListener('click', () => {
    console.log("Restore button clicked.");
    chrome.runtime.sendMessage({ action: "restoreCookie" });
});
