importScripts('github.js');

// Map LeetCode languages to extensions
const languageExtensions = {
  'cpp': 'cpp',
  'c++': 'cpp',
  'java': 'java',
  'python': 'py',
  'python3': 'py',
  'javascript': 'js',
  'typescript': 'ts',
  'c': 'c',
  'csharp': 'cs',
  'c#': 'cs',
  'ruby': 'rb',
  'swift': 'swift',
  'go': 'go',
  'scala': 'scala',
  'kotlin': 'kt',
  'rust': 'rs',
  'php': 'php',
  'sql': 'sql',
  'mysql': 'sql',
  'mssql': 'sql',
  'oraclesql': 'sql'
};

function getExtension(lang) {
  if (!lang) return 'txt';
  const cleanLang = lang.toLowerCase().trim();
  return languageExtensions[cleanLang] || cleanLang;
}

function showNotification(id, title, message) {
  chrome.notifications.create(id, {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: title,
    message: message,
    priority: 2
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'syncSubmission') {
    handleSync(request.data);
    sendResponse({ status: 'processing' });
  }
  return true;
});

async function handleSync(data) {
  const { title, difficulty, language, code, number } = data;

  // Retrieve settings
  chrome.storage.local.get(['githubUsername', 'githubRepo', 'githubToken'], async (items) => {
    const { githubUsername, githubRepo, githubToken } = items;

    if (!githubUsername || !githubRepo || !githubToken) {
      showNotification(
        'sync-error-config',
        'Configuration Required',
        'Please set your GitHub Username, Repository, and Token in the extension options.'
      );
      return;
    }

    // Format file path
    const formattedTitle = title.replace(/\s+/g, '-');
    const ext = getExtension(language);
    const filename = number ? `${number}-${formattedTitle}.${ext}` : `${formattedTitle}.${ext}`;
    
    // Path inside the repository: Difficulty/Filename
    const cleanDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
    const filePath = `${cleanDifficulty}/${filename}`;

    const commitMessage = `Add LeetCode solution: ${title}`;

    try {
      // 1. Get file SHA if file already exists
      const sha = await GithubAPI.getFileSHA(githubUsername, githubRepo, githubToken, filePath);

      // 2. Upload or update file
      const success = await GithubAPI.uploadFile(
        githubUsername,
        githubRepo,
        githubToken,
        filePath,
        code,
        commitMessage,
        sha
      );

      if (success) {
        showNotification(
          `sync-success-${Date.now()}`,
          'Sync Successful!',
          `Uploaded: ${filePath}`
        );
      } else {
        showNotification(
          `sync-failed-${Date.now()}`,
          'Sync Failed',
          `Could not upload ${filename} to repository.`
        );
      }
    } catch (err) {
      console.error(err);
      showNotification(
        `sync-failed-${Date.now()}`,
        'Sync Failed',
        `An error occurred: ${err.message}`
      );
    }
  });
}
