# Grompt Chrome Plugin

## Description
Grompt is a Chrome plugin that will re-engineer your prompts for optimal results.

## Installation

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)
- Google Chrome browser

### Downloading and Installing Grompt

1. Clone or download the Grompt repository to your local machine:
   ```
   git clone https://github.com/your-repo/Grompt.git
   ```
   or download and extract the ZIP file from the repository.

2. Navigate to the Grompt directory:
   ```
   cd Grompt
   ```

3. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

4. Open Google Chrome and navigate to `chrome://extensions/`.

5. Enable "Developer mode" by toggling the switch in the top right corner.

6. Click on "Load unpacked" button that appears after enabling Developer mode.

7. Navigate to the `Grompt_plugin` directory within the Grompt folder and select it.

8. The Grompt plugin should now be installed and visible in your Chrome extensions.

### Running the Grompt Server

1. Create a `.env` file in the root directory of the project and add your Groq API key:
   ```
   GROQ_API_KEY=your_api_key_here
   ```

2. Start the Grompt server:
   ```
   python server.py
   ```
   The server will start running on `http://localhost:5000`.

## File Structure

```
Grompt/
│   server.py
│   requirements.txt
│   .env
│   README.md
│
└───Grompt_plugin/
    │   background.js
    │   content.js
    │   icon128.png
    │   icon16.png
    │   icon48.png
    │   manifest.json
    │   popup.html
    │   popup.js
```

## Usage

1. Ensure the Grompt server is running (`python server.py`).
2. Right-click on the request input text for any LLM and select 'GROMPT!' from the context menu.
3. If the revised text doesn't auto-appear, do a 'Paste' (CTL-V).  It's that easy!

## Development

To make changes to the plugin:

1. Edit the relevant files in the Grompt_plugin directory.
2. Save your changes.
3. Go to `chrome://extensions/` in Chrome.
4. Find the Grompt plugin and click the "Reload" button.

To make changes to the server:

1. Edit `server.py` as needed.
2. Restart the server for changes to take effect.

## Troubleshooting

If you encounter any issues:

1. Ensure all files are in the correct location.
2. Check that the server is running and accessible.
3. Verify your Groq API key is correctly set in the `.env` file.
4. Check the browser console and server logs for any error messages.
5. Try disabling and re-enabling the plugin.
6. If problems persist, uninstall and reinstall the plugin.

## Support

For support, please [provide contact information or support channels].

## License

[Include license information here]