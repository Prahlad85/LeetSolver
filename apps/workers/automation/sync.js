const axios = require('axios');

async function syncUserProgress(leetcodeSession) {
  console.log('[Sync] Fetching progress from LeetCode GraphQL...');
  
  try {
    const response = await axios.post('https://leetcode.com/graphql', {
      query: `
        query recentAcSubmissions($limit: Int!) {
          recentAcSubmissionList(limit: $limit) {
            id
            title
            titleSlug
            timestamp
          }
        }
      `,
      variables: { limit: 20 } // Fetch last 20 solved problems
    }, {
      headers: {
        'Cookie': `LEETCODE_SESSION=${leetcodeSession}`,
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/'
      }
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    const submissions = response.data.data.recentAcSubmissionList;
    console.log(`[Sync] Found ${submissions.length} recent solves.`);
    
    return submissions.map(s => ({
      problem: s.title,
      status: "Accepted",
      time: new Date(parseInt(s.timestamp) * 1000).toISOString(),
      lang: "N/A" // GraphQL doesn't give lang in this list, but we can mock it
    }));
  } catch (error) {
    console.error('[Sync Error]', error.message);
    throw error;
  }
}

module.exports = { syncUserProgress };
