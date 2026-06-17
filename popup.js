document.addEventListener('DOMContentLoaded', () => {
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const openSettingsBtn = document.getElementById('open-settings-btn');

  // Check storage connection
  chrome.storage.local.get(['githubUsername', 'githubRepo', 'githubToken'], (items) => {
    if (items.githubUsername && items.githubRepo && items.githubToken) {
      statusDot.className = 'dot connected';
      statusText.textContent = `Synced to ${items.githubUsername}/${items.githubRepo}`;
    } else {
      statusDot.className = 'dot disconnected';
      statusText.textContent = 'Not configured';
    }
  });

  // Open settings/options page
  openSettingsBtn.addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });
});
