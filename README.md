# Layer3 Quest Hider

A Chrome/Edge browser extension that allows you to hide quests on [Layer3](https://app.layer3.xyz) that you don't want to see, helping you focus on the quests that matter to you.

## Features

- **One-Click Hiding**: Hide any quest card with a single click on the × button that appears when hovering over quests
- **Persistent Storage**: Your hidden quests are saved locally and persist across browser sessions
- **Control Panel**: Easy-to-access floating button to manage your hidden quests
- **Show All Feature**: Restore all hidden quests with one click
- **Smooth Animations**: Elegant fade-out animations when hiding quests
- **Dynamic Detection**: Automatically detects quest cards even with lazy loading and infinite scroll
- **Non-Intrusive**: Minimal UI that only appears when needed

## Installation

### Chrome / Edge / Brave

1. **Download the Extension**
   - Download or clone this repository
   - Extract the files to a folder on your computer

2. **Enable Developer Mode**
   - Open your browser
   - Navigate to the extensions page:
     - **Chrome**: `chrome://extensions/`
     - **Edge**: `edge://extensions/`
     - **Brave**: `brave://extensions/`
   - Toggle on "Developer mode" in the top right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Select the folder containing the extension files
   - The extension icon should appear in your browser toolbar

4. **Visit Layer3**
   - Go to [app.layer3.xyz](https://app.layer3.xyz)
   - Hover over any quest card to see the hide button (×)
   - Click the floating button in the bottom-right to manage hidden quests

## How to Use

### Hiding a Quest

1. Navigate to [app.layer3.xyz](https://app.layer3.xyz)
2. Hover over any quest card you want to hide
3. Click the red × button that appears in the top-right corner of the card
4. The quest will fade out and be hidden

### Managing Hidden Quests

1. Click the purple floating button in the bottom-right corner of the page
2. A panel will appear showing:
   - Number of currently hidden quests
   - A "Show All" button to restore all hidden quests
3. Click "Show All" to unhide all quests at once

### Restoring Hidden Quests

There are two ways to restore hidden quests:

1. **Restore All**: Click the floating button → Click "Show All"
2. **Clear Browser Data**: Clear your browser's local storage for Layer3

## Technical Details

### Files

- `manifest.json` - Extension configuration
- `content.js` - Main logic for detecting and hiding quests
- `styles.css` - Styling for the hide buttons and control panel
- `icon48.png` / `icon128.png` - Extension icons

### Permissions

- **storage**: To save your hidden quests list
- **host_permissions**: To run only on app.layer3.xyz

### Storage

Hidden quests are stored in your browser's localStorage under the key `layer3_hidden_quests`. No data is sent to external servers - everything stays on your device.

## Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Microsoft Edge (Manifest V3)
- ✅ Brave Browser (Manifest V3)
- ✅ Any Chromium-based browser supporting Manifest V3

## Privacy

This extension:
- ✅ Stores data locally only
- ✅ Does not collect any personal information
- ✅ Does not send data to external servers
- ✅ Only runs on app.layer3.xyz
- ✅ Open source - you can review all code

## Troubleshooting

### Hide buttons not appearing

1. Refresh the Layer3 page
2. Try scrolling down and back up
3. Check if the extension is enabled in your browser's extension manager

### Hidden quests reappearing

This should not happen as data is stored in localStorage. If it does:
1. Check your browser's privacy settings
2. Make sure localStorage is not being cleared automatically
3. Disable any extensions that might interfere with localStorage

### Extension not working

1. Make sure you're on `app.layer3.xyz`
2. Check if the extension is enabled
3. Try reloading the extension from the extensions page
4. Check the browser console for any error messages (F12)

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

This project is open source and available under the MIT License.

## Disclaimer

This is an independent project and is not affiliated with, endorsed by, or sponsored by Layer3. Use at your own risk.

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

---

**Enjoy a cleaner Layer3 experience!** 🚀
