chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "grompt",
        title: "Grompt!",
        contexts: ["editable"]
    });
    console.log("Grompt context menu created");
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "grompt") {
        console.log("Grompt menu item clicked");

        getApiKey().then(apiKey => {
            if (!apiKey) {
                console.log("API key not set");
                console.log("Please set your Groq API key in the Grompt extension options.");
                return;
            }

            injectContentScriptAndSendMessage(tab, apiKey);
        }).catch(error => {
            console.error("Error retrieving API key:", error);
        });
    }
});

function injectContentScriptAndSendMessage(tab, apiKey, retries = 3) {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error injecting content script:", chrome.runtime.lastError);
            return;
        }

        // Wait a bit to ensure the content script is ready
        setTimeout(() => {
            chrome.tabs.sendMessage(tab.id, { action: "refactorText", apiKey: apiKey }, response => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message to content script:", chrome.runtime.lastError.message);
                    if (retries > 0) {
                        console.log(`Retrying... (${retries} attempts left)`);
                        injectContentScriptAndSendMessage(tab, apiKey, retries - 1);
                    }
                } else {
                    console.log("Response from content script:", response);
                }
            });
        }, 100);
    });
}

function getApiKey() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['groqApiKey'], (result) => {
            console.log("API key from storage:", result.groqApiKey);
            resolve(result.groqApiKey);
        });
    });
}