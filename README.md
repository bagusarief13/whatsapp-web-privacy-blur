# 🔒 WhatsApp Web Privacy Blur

[![Version](https://img.shields.io/badge/version-1.1.1-00a884?style=flat-square)](https://github.com/bagusarief13/whatsapp-web-privacy-blur)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Supported-black?style=flat-square&logo=tampermonkey)](https://www.tampermonkey.net/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

A modern, high-performance Tampermonkey userscript that keeps your WhatsApp Web screen private from shoulder surfers, screen sharing, and onlookers. Blurs contact names, message previews, and active chat content until hovered, intercepts incoming desktop notification popups to hide message contents, and provides a collapsible floating control dock.

---

## ⚡ Direct Install

Click the button below to install directly into Tampermonkey / Violentmonkey:

[![Install Userscript](https://img.shields.io/badge/🚀_Install_Userscript-Click_Here-00a884?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://raw.githubusercontent.com/bagusarief13/whatsapp-web-privacy-blur/main/whatsapp-web-privacy-blur.user.js)

*(Requires [Tampermonkey](https://www.tampermonkey.net/) or an equivalent userscript manager installed in your browser)*

---

## ✨ Features

- **🛡️ Comprehensive Privacy Blurring & Masking**:
  - **Chat List**: Blurs contact names, last message previews, and draft texts until hovered.
  - **Messages Area**: Blurs message bubbles, media thumbnails, phone numbers, and timestamps in the active chat.
  - **Popup & Desktop Notifications**: Intercepts native OS desktop notifications (`window.Notification` & Service Worker `showNotification`) to display who the chat is from while replacing the message preview with a clean `"You have a new message"` notification, and blurs in-page toast alert banners until hovered.
  - **Smart Exclusions**: Timestamps, unread message badges, pinned icons, and delivery checkmarks remain clearly visible.
- **⚡ Instant Zero-Flash CSS**:
  - Blurring is applied via optimized CSS rules, ensuring that new incoming messages or virtualized scroll items are blurred instantly on DOM insertion without any brief unblurred flicker.
- **🎛️ Collapsible Floating Control Dock**:
  - Compact glassmorphic dock tucked in the bottom-left corner (`bottom: 10px; left: 10px;`).
  - **Collapsible Handle**: Shrinks down to a mini-shield button to keep your screen completely decluttered.
  - **Live Status Indicator**:
    - 🟢 **Green**: All blurs & interception active.
    - 🟡 **Amber**: Partial (e.g. Chats & Popups on, Messages off).
    - 🔴 **Red**: All privacy protections disabled.
- **🔀 Independent Toggle Controls**:
  - Enable or disable separately for the **Chat List** (`Chats`), **Messages** (`Messages`), and **Popup Notifications** (`Popups`).
  - Smooth 0.12s transition when switching states.
- **🔄 Instant Manual Refresh Button**:
  - Re-scans and forces blur re-application with spin feedback animation.
- **💾 Persistent Settings**:
  - Your toggle states and collapsed/expanded preferences are saved in `localStorage` and remembered across browser sessions and refreshes.
  - Automatic background rescan on tab focus and visibility change.
- **🎨 Dark & Light Theme Support**:
  - Natively adapts to WhatsApp Web's dark and light appearance.
- **🔄 Auto-Update Ready**:
  - Configured with `@updateURL` and `@downloadURL` for seamless updates directly from GitHub.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **`Alt + P`** | **Toggle Collapse / Expand** Privacy Dock |
| **`Alt + C`** | **Toggle Chat List Blur** (ON / OFF) |
| **`Alt + M`** | **Toggle Messages Blur** (ON / OFF) |
| **`Alt + N`** | **Toggle Popup Messages Interception** (ON / OFF) |
| **`Alt + R`** / **`Alt + B`** | **Refresh / Re-scan** Privacy Blur |

---

## 🚀 Installation Guide

### Method 1: One-Click Install (Recommended)
1. Install a userscript manager extension if you haven't already:
   - [Tampermonkey for Chrome / Edge / Brave](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Tampermonkey for Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
2. Click here: **[Install Script](https://raw.githubusercontent.com/bagusarief13/whatsapp-web-privacy-blur/main/whatsapp-web-privacy-blur.user.js)**.
3. Tampermonkey will open a tab prompting you to click **Install**.
4. Open or refresh [web.whatsapp.com](https://web.whatsapp.com).

### Method 2: Manual Installation
1. Open your Tampermonkey Dashboard.
2. Click on the **Utilities** tab or the **+** (New Script) tab.
3. Copy the entire contents of [`whatsapp-web-privacy-blur.user.js`](whatsapp-web-privacy-blur.user.js).
4. Paste it into the editor and press `Ctrl + S` (`Cmd + S` on macOS) to save.
5. Navigate to [web.whatsapp.com](https://web.whatsapp.com).

---

## ⚙️ Customization

If you want stronger or softer blur, or want to change the notification mask text, open `whatsapp-web-privacy-blur.user.js` in Tampermonkey and modify the constants at the top:

```javascript
const BLUR_AMOUNT = '8px'; // Change to '5px', '12px', etc.
const POPUP_MASK_TEXT = 'You have a new message'; // Change to 'New message', '••••', etc.
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
