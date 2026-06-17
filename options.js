document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const repoInput = document.getElementById('repo');
  const tokenInput = document.getElementById('token');
  const form = document.getElementById('settings-form');
  const statusEl = document.getElementById('status');
  const saveBtn = document.getElementById('save-btn');

  // Load saved configurations
  chrome.storage.local.get(['githubUsername', 'githubRepo', 'githubToken'], (items) => {
    if (items.githubUsername) usernameInput.value = items.githubUsername;
    if (items.githubRepo) repoInput.value = items.githubRepo;
    if (items.githubToken) tokenInput.value = items.githubToken;
  });

  // Handle form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const repo = repoInput.value.trim();
    const token = tokenInput.value.trim();

    statusEl.className = 'status-message';
    statusEl.style.display = 'none';
    
    saveBtn.textContent = 'Verifying...';
    saveBtn.disabled = true;

    // Verify repository exists and token is valid
    const isRepoValid = await GithubAPI.checkRepo(username, repo, token);

    if (isRepoValid) {
      // Save settings
      chrome.storage.local.set({
        githubUsername: username,
        githubRepo: repo,
        githubToken: token
      }, () => {
        statusEl.textContent = 'Configuration verified & saved successfully!';
        statusEl.className = 'status-message success';
        saveBtn.textContent = 'Save & Verify Connection';
        saveBtn.disabled = false;
      });
    } else {
      statusEl.textContent = 'Verification failed. Please check your token, username, or repository access.';
      statusEl.className = 'status-message error';
      saveBtn.textContent = 'Save & Verify Connection';
      saveBtn.disabled = false;
    }
  });
});
