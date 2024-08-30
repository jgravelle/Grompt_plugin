# background.js

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

###

# content.js

console.log("Content script loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in content script:", message);

    if (message.action === "refactorText") {
        const activeElement = document.activeElement;

        if (!activeElement) {
            console.log("No active element");
            sendResponse({ error: "No active element" });
            return;
        }

        let selectedText = null;
        if (activeElement.isContentEditable) {
            selectedText = activeElement.innerText;
        } else if (activeElement.value) {
            selectedText = activeElement.value;
        }

        if (!selectedText) {
            console.log("No text input element focused or no text selected");
            sendResponse({ error: "No text input element focused or no text selected" });
            return;
        }

        console.log("Selected text:", selectedText);

        const url = 'http://localhost:5000/rephrase';
        console.log("Fetching URL:", url);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${message.apiKey}`
            },
            body: JSON.stringify({ prompt: selectedText })
        })
        .then(response => {
            console.log("Fetch response:", response);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(result => {
            console.log("Result:", result);
            if (result.rephrased) {
                if (activeElement.isContentEditable) {
                    activeElement.innerText = result.rephrased;
                } else {
                    activeElement.value = result.rephrased;
                }
                copyToClipboard(result.rephrased);
                sendResponse({ success: true, rephrased: result.rephrased });
            } else {
                sendResponse({ success: false, error: "Failed to rephrase the text" });
            }
        })
        .catch(error => {
            console.error("Error during fetch:", error);
            sendResponse({ success: false, error: error.message });
        });

        return true; // keep the messaging channel open for sendResponse
    }
});

function copyToClipboard(text) {
    console.log("Copying to clipboard:", text);
    navigator.clipboard.writeText(text).then(() => {
        console.log("Copied to clipboard successfully!");
    }).catch(err => {
        console.error("Failed to copy to clipboard:", err);
    });
}

###

# manifest.json

{
    "manifest_version": 3,
    "name": "Grompt",
    "description": "Refactor text using Grompt.",
    "version": "1.0",
    "permissions": [
        "contextMenus",
        "storage",
        "activeTab",
        "scripting"
    ],
    "background": {
        "service_worker": "background.js"
    },
    "action": {
        "default_popup": "popup.html",
        "default_icon": {
            "16": "icon16.png",
            "48": "icon48.png",
            "128": "icon128.png"
        }
    },
    "icons": {
        "16": "icon16.png",
        "48": "icon48.png",
        "128": "icon128.png"
    },
    "content_scripts": [
        {
            "matches": ["<all_urls>"],
            "js": ["content.js"],
            "run_at": "document_idle"
        }
    ]
}

###

# popup.html

<!DOCTYPE html>
<html>
<head>
    <title>Grompt Configuration</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            width: 200px;
        }
    </style>
</head>
<body>
    <h3>Grompt Configuration</h3>
    <div>
        <label for="apiKey">Groq API Key:</label>
        <input type="text" id="apiKey" style="width: 100%;">
    </div>
    <button id="saveButton">Save</button>
    <script src="popup.js"></script>
</body>
</html>

###

# popup.js

document.getElementById('saveButton').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.sync.set({ groqApiKey: apiKey }, () => {
        console.log('API Key saved:', apiKey);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['groqApiKey'], (result) => {
        if (result.groqApiKey) {
            document.getElementById('apiKey').value = result.groqApiKey;
            console.log('API Key loaded:', result.groqApiKey);
        }
    });
});