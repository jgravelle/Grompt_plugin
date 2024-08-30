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