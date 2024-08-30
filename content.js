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