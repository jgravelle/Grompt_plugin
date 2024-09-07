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
            selectedText = window.getSelection().toString() || activeElement.innerText;
        } else if (activeElement.value) {
            selectedText = activeElement.value.substring(activeElement.selectionStart, activeElement.selectionEnd) || activeElement.value;
        }

        if (!selectedText) {
            console.log("No text input element focused or no text selected");
            sendResponse({ error: "No text input element focused or no text selected" });
            return;
        }

        console.log("Selected text:", selectedText);

        const url = 'https://api.groq.com/openai/v1/chat/completions';
        console.log("Fetching URL:", url);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${message.apiKey}`
            },
            body: JSON.stringify({
                model: "llama3-groq-70b-8192-tool-use-preview",
                messages: [
                    {role: "system", content: "You are a professional prompt engineer. Your task is to optimize the user's prompt by making it clearer, more concise, and more effective. Only output the improved prompt without adding any commentary or labels. If the original prompt is already optimized, return it unchanged."},
                    {role: "user", content: `${selectedText}`}
                ],
                max_tokens: 512,
                temperature: 0.3
            })
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
            if (result.choices && result.choices[0] && result.choices[0].message) {
                let rephrased = result.choices[0].message.content.trim();
                
                // Remove surrounding quotes if present
                if ((rephrased.startsWith('"') && rephrased.endsWith('"')) || (rephrased.startsWith("'") && rephrased.endsWith("'"))) {
                    rephrased = rephrased.slice(1, -1);
                }
                
                if (activeElement.isContentEditable) {
                    activeElement.innerText = rephrased;
                } else {
                    activeElement.value = rephrased;
                }
                copyToClipboard(rephrased);
                sendResponse({ success: true, rephrased: rephrased });
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