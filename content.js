/**
 * LeetCode GitHub Auto Sync Content Script
 */

// Inject network interceptor script into the page context
function injectInterceptor() {
  const script = document.createElement('script');
  script.id = 'leetcode-sync-interceptor';
  script.textContent = `
    (function() {
      const originalFetch = window.fetch;
      
      // Store submission details temporarily
      let lastSubmission = null;

      window.fetch = async function(...args) {
        const url = args[0];
        const options = args[1];

        // Intercept Submit Request
        if (typeof url === 'string' && url.includes('/submit/')) {
          try {
            if (options && options.body) {
              const body = JSON.parse(options.body);
              lastSubmission = {
                question_id: body.question_id,
                lang: body.lang,
                code: body.typed_code,
                titleSlug: url.split('/problems/')[1]?.split('/')[0] || ''
              };
            }
          } catch (e) {
            console.error('Error parsing submit request body:', e);
          }
        }

        const response = await originalFetch.apply(this, args);

        // Intercept Check Request (traditional check API)
        if (typeof url === 'string' && url.includes('/check/')) {
          try {
            const clone = response.clone();
            const data = await clone.json();
            
            if (data && data.state === 'SUCCESS' && data.status_msg === 'Accepted') {
              if (lastSubmission) {
                // Trigger event with all extracted info
                document.dispatchEvent(new CustomEvent('LeetCodeSubmissionAccepted', {
                  detail: {
                    ...lastSubmission,
                    difficulty: data.difficulty || null
                  }
                }));
                lastSubmission = null; // Reset
              }
            }
          } catch (e) {
            console.error('Error parsing check response:', e);
          }
        }

        // Intercept GraphQL requests (new GraphQL-based submission flow)
        if (typeof url === 'string' && url.includes('/graphql')) {
          try {
            if (options && options.body) {
              const reqBody = JSON.parse(options.body);
              // Check if it's a submission or checking mutation/query
              if (reqBody.query && (reqBody.query.includes('submit') || reqBody.query.includes('Submission'))) {
                const clone = response.clone();
                const data = await clone.json();
                
                // Inspect response for accepted status
                if (data && data.data) {
                  // Handle different possible GQL response structures
                  const submissionResult = data.data.submissionStatus || data.data.checkSubmissionStatus;
                  if (submissionResult && submissionResult.status_msg === 'Accepted') {
                    document.dispatchEvent(new CustomEvent('LeetCodeSubmissionAccepted', {
                      detail: {
                        question_id: submissionResult.question_id,
                        lang: submissionResult.lang || submissionResult.language,
                        code: submissionResult.code || submissionResult.typed_code,
                        titleSlug: submissionResult.title_slug || '',
                        difficulty: submissionResult.difficulty
                      }
                    }));
                  }
                }
              }
            }
          } catch (e) {
            // Ignore parse errors for irrelevant GQL queries
          }
        }

        return response;
      };
    })();
  `;
  (document.head || document.documentElement).appendChild(script);
}

// Inject the script
injectInterceptor();

// Listen to Accepted submission event from the page context
document.addEventListener('LeetCodeSubmissionAccepted', (e) => {
  const submission = e.detail;

  // Extract difficulty and title from DOM as backup / enrichment
  const difficulty = submission.difficulty || extractDifficulty();
  const title = extractTitle() || formatTitleSlug(submission.titleSlug);
  const number = submission.question_id || extractProblemNumber();

  const syncData = {
    title: title,
    difficulty: difficulty,
    language: submission.lang,
    code: submission.code,
    number: number
  };

  // Send message to background script for sync
  chrome.runtime.sendMessage({
    action: 'syncSubmission',
    data: syncData
  });
});

// Helper: Extract difficulty from the DOM
function extractDifficulty() {
  const easyEl = document.querySelector('.text-difficulty-easy, .text-easy, [class*="text-easy"]');
  if (easyEl) return 'Easy';
  const mediumEl = document.querySelector('.text-difficulty-medium, .text-medium, [class*="text-medium"]');
  if (mediumEl) return 'Medium';
  const hardEl = document.querySelector('.text-difficulty-hard, .text-hard, [class*="text-hard"]');
  if (hardEl) return 'Hard';

  // Fallback: Scan text content of elements
  const allElements = document.querySelectorAll('span, div');
  for (const el of allElements) {
    const text = el.textContent.trim();
    if (text === 'Easy') return 'Easy';
    if (text === 'Medium') return 'Medium';
    if (text === 'Hard') return 'Hard';
  }
  return 'Easy'; // Default fallback
}

// Helper: Extract Title from DOM
function extractTitle() {
  // Try selector for main heading
  const titleEl = document.querySelector('.text-title-large, h4, [data-cy="question-title"]');
  if (titleEl) {
    const text = titleEl.textContent.trim();
    // Strip problem number if it's included like "1. Two Sum"
    return text.replace(/^\d+\.\s*/, '');
  }
  return '';
}

// Helper: Extract Problem Number from DOM
function extractProblemNumber() {
  const titleEl = document.querySelector('.text-title-large, h4, [data-cy="question-title"]');
  if (titleEl) {
    const text = titleEl.textContent.trim();
    const match = text.match(/^(\d+)\./);
    if (match) {
      return match[1];
    }
  }
  return '';
}

// Helper: Format title slug (e.g. "two-sum" -> "Two Sum")
function formatTitleSlug(slug) {
  if (!slug) return 'Unknown Problem';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
