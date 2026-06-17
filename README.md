# LeetCode GitHub Auto Sync

A lightweight, clean, and completely free Google Chrome Extension (Manifest V3) that automatically syncs your accepted LeetCode solutions directly to a GitHub repository of your choice.

## Features
- **Auto-Sync**: Automatically detects accepted submissions on leetcode.com and uploads them.
- **Dynamic folder organization**: Organizes solutions under folders named after their difficulty: `Easy/`, `Medium/`, or `Hard/`.
- **Smart filenames**: Standardizes solution file naming structure: `<problem-number>-<problem-title>.<extension>` (e.g., `Easy/1-Two-Sum.cpp`).
- **Update capability**: Detects existing file versions and commits updates instead of creating duplicates or failing.
- **Native Notifications**: Shows clean browser notifications for successful or failed uploads.
- **Private & Safe**: Completely serverless, communicating directly with the GitHub API. No backend, no third-party tracking.

---

## Installation Instructions

To install the extension in Google Chrome:

1. **Download / Copy the source folder**: Ensure all the project files are saved in a directory (e.g., `leetcode-github-auto-sync`).
2. **Open Extensions Page**: In Chrome, navigate to `chrome://extensions/`.
3. **Enable Developer Mode**: Toggle the **Developer mode** switch in the top-right corner of the page.
4. **Load Unpacked**: Click the **Load unpacked** button in the top-left corner.
5. **Select Folder**: Choose the `leetcode-github-auto-sync` folder that contains `manifest.json`.
6. The extension is now loaded! You will see the icon in your extension bar.

---

## How to Create a GitHub Personal Access Token (PAT)

For the extension to write solutions to your repository, you need to configure a token with minimal permissions. You can use either **Classic** or **Fine-Grained** tokens:

### Option A: Fine-Grained Tokens (Recommended)
1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens > Fine-grained tokens](https://github.com/settings/tokens?type=beta).
2. Click **Generate new token**.
3. Name your token (e.g., `LeetCode Auto Sync Token`) and set an expiration date.
4. Under **Repository access**, select **Only select repositories** and pick the repository where you want to sync your solutions.
5. Under **Permissions**, click **Repository permissions**:
   - Scroll down to **Contents** and change it to **Read and write**.
6. Scroll to the bottom and click **Generate token**.
7. Copy the generated token immediately (you won't be able to see it again).

### Option B: Classic Tokens
1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens > Tokens (classic)](https://github.com/settings/tokens).
2. Click **Generate new token > Generate new token (classic)**.
3. Name your token and set an expiration date.
4. Under scopes, select the **repo** checkbox (grants full control of private and public repositories).
5. Scroll to the bottom and click **Generate token**.
6. Copy the generated token immediately.

---

## Configuration & Usage

1. Click the **LeetCode GitHub Auto Sync** extension icon in your Chrome extension bar.
2. Click **Configure Settings** (or open the extension options page).
3. Fill in:
   - **GitHub Username** (e.g. `your-github-username`)
   - **Repository Name** (e.g. `LeetCode-Solutions` - *Note: The repository must already exist on GitHub*)
   - **GitHub Personal Access Token**
4. Click **Save & Verify Connection**. The extension will check if the repository is accessible and save your settings.
5. Navigate to [leetcode.com](https://leetcode.com) and solve a problem!
6. Upon clicking **Submit** and receiving an **Accepted** response, you will get a browser notification confirming your solution has been synced to GitHub.
