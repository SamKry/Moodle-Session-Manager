// Set default settings on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ autoSaveEnabled: true }, () => {
        console.log("Auto-save/restore enabled by default.");
    });
});


function getCurrentDomain(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = new URL(tabs[0].url);
        const fullUrl = `${url.protocol}//${url.hostname}`;
        console.log("Current domain with protocol:", fullUrl);
        callback(fullUrl);
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "saveCookie") {
        saveMoodleSessionCookie();
    } else if (message.action === "restoreCookie") {
        restoreMoodleSessionCookie();
    }
});

function saveMoodleSessionCookie() {
    getCurrentDomain((moodleDomain) => {
        console.log("Attempting to save MoodleSession cookie...");
        chrome.cookies.get({ url: moodleDomain, name: "MoodleSession" }, (cookie) => {
            if (cookie) {
                console.log("Cookie found:", cookie);
                // Use chrome.storage.local to save the cookie
                chrome.storage.local.set({ MoodleSession: JSON.stringify(cookie) }, () => {
                    console.log("Moodle session cookie saved.");
                });
            } else {
                console.log("No MoodleSession cookie found.");
            }
        });
    });
}

function restoreMoodleSessionCookie() {
    getCurrentDomain((moodleDomain) => {
        console.log("Attempting to restore MoodleSession cookie...");
        
        chrome.storage.local.get("MoodleSession", (result) => {
            const savedCookie = result.MoodleSession;
            
            if (savedCookie) {
                console.log("Saved cookie found:", savedCookie);
                const cookieData = JSON.parse(savedCookie);
                
                // Continue with cookie restoration
                chrome.cookies.set({
                url: `https://${moodleDomain}`,
                name: cookieData.name,
                value: cookieData.value,
                domain: cookieData.domain,
                path: cookieData.path,
                secure: cookieData.secure,
                httpOnly: cookieData.httpOnly,
                expirationDate: cookieData.expirationDate
                }, (setCookie) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error setting cookie:", chrome.runtime.lastError);
                    } else {
                        console.log("Moodle session cookie restored:", setCookie);
                        
                        // Send message to content script to reload the page
                        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                            chrome.tabs.sendMessage(tabs[0].id, { action: "reloadPage" });
                        });
                    }
                });
            } else {
                console.log("No saved MoodleSession cookie found.");
            }
        });
    });
}
