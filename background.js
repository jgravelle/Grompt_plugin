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
                chrome.tabs.sendMessage(tab.id, { action: "showNotification", message: "Please set your Groq API key in the Grompt extension options." });
                return;
            }

            chrome.tabs.sendMessage(tab.id, { action: "refactorText", apiKey: apiKey }, response => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message to content script:", chrome.runtime.lastError.message);
                } else {
                    console.log("Response from content script:", response);
                }
            });
        }).catch(error => {
            console.error("Error retrieving API key:", error);
        });
    }
});

function getApiKey() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['groqApiKey'], (result) => {
            console.log("API key retrieved from storage");
            resolve(result.groqApiKey);
        });
    });
}