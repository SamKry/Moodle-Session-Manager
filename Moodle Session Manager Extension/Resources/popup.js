const autoSaveCheckbox = document.getElementById('autoSaveCheckbox');

// Load the checkbox state from storage
chrome.storage.local.get('autoSaveEnabled', (data) => {
    autoSaveCheckbox.checked = data.autoSaveEnabled || false;
});

// Save checkbox state when user changes it
autoSaveCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ autoSaveEnabled: autoSaveCheckbox.checked });
});

// Add event listeners for save and restore buttons
document.getElementById('save').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "saveCookie" });
});

document.getElementById('restore').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "restoreCookie" });
    });
