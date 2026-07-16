import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./db/schema"; 

// Safely define Drizzle's strict insert types
type NewDeveloper = typeof schema.developers.$inferInsert;
type NewMergeRequest = typeof schema.merge_requests.$inferInsert;
type NewCommit = typeof schema.commits.$inferInsert;

// Initialize Drizzle client using LibSQL driver
const db = drizzle(process.env.DB_FILE_NAME!);

// Date helper utilities
function getRandomDate(daysAgoMax: number): string {
  const date = new Date();
  const daysAgo = Math.floor(Math.random() * daysAgoMax);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function addHours(dateStr: string, hours: number): string {
  const date = new Date(dateStr.replace(' ', 'T') + 'Z');
  date.setHours(date.getHours() + hours);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

async function main() {
  console.log("Starting clean Drizzle seeding execution...");

  // 1. Insert 10 Developers (with required email & team)
  const mockDevNames = [
    'Ahmet Yilmaz', 'Ayse Demir', 'Mehmet Kaya', 'Fatma Celik', 
    'Ali Ozturk', 'Can Yurt', 'Ece Tekin', 'Naz Oz', 'Umut Can', 'Ghost Coder'
  ];
  
  const teams = ['Frontend', 'Backend', 'DevOps', 'QA'];

  console.log("Inserting developers...");
  const devValues: NewDeveloper[] = mockDevNames.map((name) => {
    // Generate a clean email based on their name (e.g., "ahmet.yilmaz@company.com")
    const cleanEmail = name.toLowerCase().replace(/\s+/g, '.') + "@company.com";
    const randomTeam = teams[Math.floor(Math.random() * teams.length)];

    return {
      name,
      email: cleanEmail,
      team: randomTeam,
    };
  });

  const insertedDevs = await db
    .insert(schema.developers)
    .values(devValues)
    .returning({ id: schema.developers.id });

  const devIds = insertedDevs.map((d) => d.id);
  // Separate out the last dev ("Ghost Coder") as clean for your assignment logic
  const activeDevIds = devIds.slice(0, -1); 
  const ghostDevId = devIds[devIds.length - 1];

  console.log(`Active Dev IDs: ${activeDevIds}. Ghost Dev ID: ${ghostDevId}`);

  // 2. Insert 35 Merge Requests
  console.log("Inserting 35 merge requests...");
  const mrValues: NewMergeRequest[] = [];
  const statuses = ['merged', 'open', 'closed'];

  for (let i = 1; i <= 35; i++) {
    const createdAt = getRandomDate(40);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    mrValues.push({
      title: `Fix issue #${100 + i}`,
      developer_id: activeDevIds[Math.floor(Math.random() * activeDevIds.length)],
      status: status,
      created_at: createdAt,
      merged_at: status === 'merged' ? addHours(createdAt, Math.floor(Math.random() * 48) + 2) : null,
    });
  }

  const insertedMRs = await db
    .insert(schema.merge_requests)
    .values(mrValues)
    .returning({ id: schema.merge_requests.id });

  const mrIds = insertedMRs.map((m) => m.id);

  // 3. Insert 115 Commits
  console.log("Inserting 115 commits...");
  const commitValues: NewCommit[] = [];
  const commitMessages = [
    "Refactor auth logic", 
    "Fix nasty production bug", 
    "Add missing unit tests", 
    "Update documentation", 
    "Typo fix", 
    "Optimize SQL queries"
  ];

  for (let i = 1; i <= 115; i++) {
    commitValues.push({
      message: commitMessages[Math.floor(Math.random() * commitMessages.length)],
      developer_id: activeDevIds[Math.floor(Math.random() * activeDevIds.length)],
      merge_request_id: mrIds[Math.floor(Math.random() * mrIds.length)],
      created_at: getRandomDate(40),
    });
  }

  await db.insert(schema.commits).values(commitValues);

  console.log("✨ Seed process fully complete! All data stored safely via Drizzle.");
}

main().catch((err) => {
  console.error(" Critical seeding failure:", err);
});