/**
 * GitHub API Helper functions
 */
const GithubAPI = {
  /**
   * Check if a repository exists and is accessible.
   * @param {string} username 
   * @param {string} repo 
   * @param {string} token 
   * @returns {Promise<boolean>}
   */
  async checkRepo(username, repo, token) {
    const url = `https://api.github.com/repos/${username}/${repo}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      return response.status === 200;
    } catch (error) {
      console.error('Error checking repo:', error);
      return false;
    }
  },

  /**
   * Get the SHA of a file at a specific path in the repo.
   * @param {string} username 
   * @param {string} repo 
   * @param {string} token 
   * @param {string} path 
   * @returns {Promise<string|null>}
   */
  async getFileSHA(username, repo, token, path) {
    const url = `https://api.github.com/repos/${username}/${repo}/contents/${encodeURIComponent(path)}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (response.status === 200) {
        const data = await response.json();
        return data.sha;
      }
      return null;
    } catch (error) {
      console.error('Error fetching file SHA:', error);
      return null;
    }
  },

  /**
   * Upload or update a file in the repository.
   * @param {string} username 
   * @param {string} repo 
   * @param {string} token 
   * @param {string} path 
   * @param {string} content 
   * @param {string} message 
   * @param {string|null} sha 
   * @returns {Promise<boolean>}
   */
  async uploadFile(username, repo, token, path, content, message, sha = null) {
    const url = `https://api.github.com/repos/${username}/${repo}/contents/${encodeURIComponent(path)}`;
    
    // Base64 encode file content correctly handling Unicode characters
    const base64Content = btoa(unescape(encodeURIComponent(content)));

    const body = {
      message: message,
      content: base64Content
    };

    if (sha) {
      body.sha = sha;
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.status === 200 || response.status === 201) {
        return true;
      }
      const errData = await response.json();
      console.error('GitHub API Error response:', errData);
      return false;
    } catch (error) {
      console.error('Error uploading file:', error);
      return false;
    }
  }
};
