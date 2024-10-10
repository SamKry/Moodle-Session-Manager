document.getElementById('save').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "saveCookie" });
});

document.getElementById('restore').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "restoreCookie" });
});
