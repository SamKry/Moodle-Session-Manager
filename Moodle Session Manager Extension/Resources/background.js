// Get the current tab's URL and extract the domain
function getCurrentDomain(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = new URL(tabs[0].url);
        console.log("URL: ", url);
        callback(url.hostname);
    });
}

// Message listener
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
        chrome.cookies.get({ url: `https://${moodleDomain}`, name: "MoodleSession" }, (cookie) => {
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
        console.log("finished attempt.");
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
