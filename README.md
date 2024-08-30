# Grompt Chrome Plugin

## Description
Grompt is a self-contained Chrome plugin that re-engineers your prompts for optimal results using the Groq API. It allows users to quickly refine their prompts directly within their browser, enhancing the quality of their AI interactions.

## Installation

### Prerequisites
- Google Chrome browser
- Groq API key

### Installing the Grompt Plugin

1. Clone or download the Grompt repository to your local machine:
   ```
   git clone https://github.com/your-repo/Grompt.git
   ```
   or download and extract the ZIP file from the repository.

2. Open Google Chrome and navigate to `chrome://extensions/`.

3. Enable "Developer mode" by toggling the switch in the top right corner.

4. Click on "Load unpacked" button that appears after enabling Developer mode.

5. Navigate to the `Grompt_plugin` directory within the Grompt folder and select it.

6. The Grompt plugin should now be installed and visible in your Chrome extensions.

## Configuration

1. Click on the Grompt icon in your Chrome toolbar to open the popup.
2. Enter your Groq API key in the provided field.
3. Click "Save" to store your API key securely.

## File Structure

```
Grompt_plugin/
│   background.js
│   content.js
│   icon128.png
│   icon16.png
│   icon48.png
│   manifest.json
│   popup.html
│   popup.js
│   README.md
```

## Usage

1. Right-click on the request input text for any LLM and select 'GROMPT!' from the context menu.
2. The optimized text will replace the original text and be copied to your clipboard.
3. If the revised text doesn't auto-appear, do a 'Paste' (CTL-V). It's that easy!

## Development

To make changes to the plugin:

1. Edit the relevant files in the Grompt_plugin directory.
2. Save your changes.
3. Go to `chrome://extensions/` in Chrome.
4. Find the Grompt plugin and click the "Reload" button.

## Troubleshooting

If you encounter any issues:

1. Ensure your Groq API key is correctly entered in the plugin settings.
2. Check the browser console for any error messages.
3. Verify that you have an active internet connection.
4. Try disabling and re-enabling the plugin.
5. If problems persist, uninstall and reinstall the plugin.

## Security Note

Your Groq API key is stored securely in Chrome's sync storage. However, always keep your API keys confidential and do not share them publicly.

## Support

For support, please get a puppy.  Second option: GitHub.

## License

Grompt! is proudly open-source and released under the [MIT License](https://opensource.org/licenses/MIT).

Thank you for choosing Grompt! as your AI-powered conversational assistant. We are committed to redefining the boundaries of what AI can achieve and empowering you to tackle any question, problem, or project with ease and efficiency.

## Copyright (c)2024 J. Gravelle

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

**1. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.**

**2. Any modifications made to the Software must clearly indicate that they are derived from the original work, and the name of the original author (J. Gravelle) must remain intact.**

**3. Redistributions of the Software in source code form must also include a prominent notice that the code has been modified from the original.**

THE SOFTWARE IS PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

