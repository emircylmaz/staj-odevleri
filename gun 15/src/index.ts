import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { count, desc, sql } from "drizzle-orm";
import "dotenv/config";
import path from "path";
import { repos as reposTable } from "./db/schema.js";
import { z } from "zod";
import { config } from "./config.js";

// ============================================================================
// 1. DATABASE & CONFIG SETUP
// ============================================================================
const dbPath = path.resolve(process.cwd(), config.DB_PATH);
const sqlite = new Database(dbPath);
const db = drizzle(sqlite as any, { schema: { repos: reposTable } } as any);

// ============================================================================
// 2. ZOD SCHEMA & TYPES
// ============================================================================
export const githubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  private: z.boolean(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
});

export type githubRepo = z.infer<typeof githubRepoSchema>;

const GITHUB_TOKEN = config.GITHUB_TOKEN;
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// 3. FETCH FUNCTION
// ============================================================================
async function fetchOrgRepos(
  orgName: string,
  customToken: string | undefined = GITHUB_TOKEN,
): Promise<unknown[] | null> {
  let page = 1;
  const perPage = 100;
  const allRepos: unknown[] = [];
  let retryCount = 0;

  console.log(`\nFetching repos for organization: "${orgName}"...`);

  while (true) {
    const url = `https://api.github.com/orgs/${orgName}/repos?per_page=${perPage}&page=${page}`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "TypeScript-App",
          Authorization: customToken ? `Bearer ${customToken}` : "",
          Accept: "application/vnd.github+json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("401 Unauthorized: Invalid or missing GitHub Token.");
        } else if (response.status === 404) {
          throw new Error(
            `404 Not Found: Organization "${orgName}" does not exist.`,
          );
        } else if (response.status === 429) {
          if (retryCount < 1) {
            retryCount++;
            console.warn(
              `429 Rate Limited: Waiting 5 seconds before retrying page ${page}...`,
            );
            await sleep(5000);
            continue;
          }
          throw new Error("429 Rate Limited: Retry limit reached.");
        } else if (response.status >= 500) {
          throw new Error(`500 Server Error (${response.status}).`);
        } else {
          throw new Error(`HTTP Error Status: ${response.status}`);
        }
      }

      retryCount = 0;
      const repos = (await response.json()) as unknown[];

      if (repos.length === 0) break;

      allRepos.push(...repos);
      console.log(`Page ${page} fetched (${repos.length} repos)`);
      page++;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error("An unexpected error occurred:", error);
      }
      return null;
    }
  }

  console.log(`\nAPI Fetch Summary:`);
  console.log(`- Total pages fetched: ${page - 1}`);
  console.log(`- Total repositories fetched: ${allRepos.length}`);

  return allRepos;
}

// ============================================================================
// 4. MAIN WORKFLOW
// ============================================================================
async function main(): Promise<void> {
  const orgName = process.argv[2];
  if (!orgName) {
    console.error("❌ Error: Missing organization name.");
    console.error("Usage: npm run sync -- <org_name>");
    process.exit(1);
  }

  // 1. Fetch raw repositories
  const rawRepos = await fetchOrgRepos(orgName);
  if (!rawRepos || rawRepos.length === 0) {
    console.log("No repositories fetched. Exiting sync.");
    return;
  }

  // Inject intentionally broken data (Requirement #2)
  rawRepos.push({ id: "invalid-string-id", name: "bad-repo" } as any);
  rawRepos.push({ name: "missing-id-repo" } as any);

  // 2. Validation Layer (Requirement #1 & #2)
  const validRepos: githubRepo[] = [];
  const invalidReports: string[] = [];

  for (const rawItem of rawRepos) {
    const result = githubRepoSchema.safeParse(rawItem);

    if (result.success) {
      validRepos.push(result.data);
    } else {
      const repoName = (rawItem as any)?.name ?? "Unknown Repo";
      const issueMessages = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");

      invalidReports.push(`[${repoName}] -> ${issueMessages}`);
    }
  }

  console.log(`\n🔍 Validation Layer Results:`);
  console.log(`- ${validRepos.length} records passed validation.`);
  console.log(`- ${invalidReports.length} records failed and were skipped.`);

  if (invalidReports.length > 0) {
    console.log("\n❌ Detailed Failure Report:");
    invalidReports.forEach((report) => console.log(` • ${report}`));
  }

  // 3. Table Creation
  console.log("\n🛠️ Ensuring database schema exists...");
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS repos (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      language TEXT,
      stars INTEGER NOT NULL DEFAULT 0,
      url TEXT NOT NULL,
      fetched_at TEXT NOT NULL
    );
  `);

  // 4. Save Valid Repositories
  console.log("💾 Syncing repositories to database...");
  for (const repo of validRepos) {
    await db
      .insert(reposTable)
      .values({
        id: repo.id,
        name: repo.name,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url,
        fetched_at: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: reposTable.id,
        set: {
          name: repo.name,
          language: repo.language,
          stars: repo.stargazers_count,
          url: repo.html_url,
          fetched_at: new Date().toISOString(),
        },
      });
  }

  console.log("✅ Database sync complete!");

  // 5. Final Report
  console.log("\n================ DATABASE SUMMARY REPORT ================");

  const totalCountResult = await db.select({ value: count() }).from(reposTable);
  console.log(`📊 Total Repositories in DB: ${totalCountResult[0].value}`);

  const languageStats = await db
    .select({
      language: reposTable.language,
      total: count(),
    })
    .from(reposTable)
    .groupBy(reposTable.language);

  console.log("\n🌐 Language Breakdown:");
  languageStats.forEach((stat) => {
    console.log(`   - ${stat.language ?? "Unknown/None"}: ${stat.total}`);
  });

  const topRepos = await db
    .select()
    .from(reposTable)
    .orderBy(desc(reposTable.stars))
    .limit(5);

  console.log("\n⭐ Top 5 Most Starred Repositories:");
  topRepos.forEach((repo, index) => {
    console.log(
      `   ${index + 1}. ${repo.name} (${repo.stars} stars) -> ${repo.url}`,
    );
  });

  console.log("=========================================================\n");
}

main().catch(console.error);
