import fs from 'fs/promises';
import 'dotenv/config';

// Define GitHub Repository Interface for type safety
interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  [key: string]: unknown;
}

const GITHUB_TOKEN: string | undefined = process.env.GITHUB_TOKEN;

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchOrgRepos(
  orgName: string,
  customToken: string | undefined = GITHUB_TOKEN,
  attemptRetry = true
): Promise<GitHubRepo[] | null> {
  let page = 1;
  const perPage = 100;
  const allRepos: GitHubRepo[] = [];

  console.log(`\nFetching repos for organization: "${orgName}"...`);

  while (true) {
    const url = `https://api.github.com/orgs/${orgName}/repos?per_page=${perPage}&page=${page}`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TypeScript-App',
          'Authorization': customToken ? `Bearer ${customToken}` : '',
          'Accept': 'application/vnd.github+json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('401 Unauthorized: Invalid or missing GitHub Token.');
        } else if (response.status === 404) {
          throw new Error(`404 Not Found: Organization "${orgName}" does not exist.`);
        } else if (response.status === 429) {
          if (attemptRetry) {
            console.warn('429 Rate Limited: Waiting 5 seconds before retrying...');
            await sleep(5000);
            return fetchOrgRepos(orgName, customToken, false); // Retry once
          }
          throw new Error('429 Rate Limited: Retry limit reached.');
        } else if (response.status >= 500) {
          throw new Error(`500 Server Error: GitHub servers experiencing issues (${response.status}).`);
        } else {
          throw new Error(`HTTP Error Status: ${response.status}`);
        }
      }

      const repos: GitHubRepo[] = (await response.json()) as GitHubRepo[];

      if (repos.length === 0) {
        break;
      }

      allRepos.push(...repos);
      console.log(`Page ${page} fetched (${repos.length} repos)`);
      page++;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('Network Error: Unable to reach GitHub API. Check your connection.');
        } else {
          console.error(`Error: ${error.message}`);
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
      return null;
    }
  }

  const totalPages = page - 1;
  console.log(`\nSummary:`);
  console.log(`- Total pages fetched: ${totalPages}`);
  console.log(`- Total repositories: ${allRepos.length}`);

  return allRepos;
}

async function main(): Promise<void> {
  const repos = await fetchOrgRepos('microsoft');

  if (repos) {
    await fs.writeFile('repos.json', JSON.stringify(repos, null, 2));
    console.log('Successfully saved repositories to repos.json!');
  }

  console.log('\n--- Running Required Error Tests ---');

  console.log('\n[Test 1] Testing 401 Unauthorized...');
  await fetchOrgRepos('microsoft', 'invalid_token_12345');

  console.log('\n[Test 2] Testing 404 Not Found...');
  await fetchOrgRepos('this-organization-definitely-does-not-exist-12345');
}

main();