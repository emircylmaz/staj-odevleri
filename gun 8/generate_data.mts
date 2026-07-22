import Database from 'better-sqlite3';

// Connect to your existing staj.db
const db = new Database('staj.db');

// Enable foreign keys just in case
db.pragma('journal_mode = WAL');

// Helper function to generate random dates within the last 40 days
function getRandomDate(daysAgoMax: number): string {
    const date = new Date();
    const daysAgo = Math.floor(Math.random() * daysAgoMax);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Helper function to add hours to a date string
function addHours(dateStr: string, hours: number): string {
    const date = new Date(dateStr.replace(' ', 'T') + 'Z');
    date.setHours(date.getHours() + hours);
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

try {
    // 1. Let's make sure we have developers in the 'developers' table first
    // (Since your tables depend on developer_id)
    const checkDevs = db.prepare("SELECT COUNT(*) as count FROM developers").get() as { count: number };
    
    if (checkDevs.count === 0) {
        console.log("Developers table is empty. Inserting some mock developers...");
        const insertDev = db.prepare("INSERT INTO developers (name) VALUES (?)");
        const mockDevs = ['Ahmet Yilmaz', 'Ayse Demir', 'Mehmet Kaya', 'Fatma Celik', 'Ali Ozturk', 'Ghost Coder'];
        
        const insertManyDevs = db.transaction((devs: string[]) => {
            for (const dev of devs) insertDev.run(dev);
        });
        insertManyDevs(mockDevs);
    }

    // Get valid developer IDs from the database
    let devs = db.prepare("SELECT id FROM developers").all() as { id: number }[];
    let devIds = devs.map(d => d.id);

    // --- LATENT BUG FIX ---
    // En az 2 geliştirici olmasını garanti ediyoruz, böylece activeDevIds boş kalıp undefined/NULL üretmez
    if (devIds.length < 2) {
        console.log("Q5 için en az 2 geliştirici gereklidir. Ek 'Ghost Coder' ekleniyor...");
        const insertDev = db.prepare("INSERT INTO developers (name) VALUES (?)");
        insertDev.run('Ghost Coder');
        
        devs = db.prepare("SELECT id FROM developers").all() as { id: number }[];
        devIds = devs.map(d => d.id);
    }
    
    // Split developers so we keep one developer completely clean (no commits/MRs) for Q5
    const activeDevIds = devIds.slice(0, -1); 
    const ghostDevId = devIds[devIds.length - 1];

    console.log(`Active Dev IDs: ${activeDevIds}. Ghost Dev ID: ${ghostDevId}`);

    // 2. Insert at least 30 Merge Requests (Generating 35)
    console.log("Inserting merge requests...");
    const insertMR = db.prepare(`
        INSERT INTO merge_requests (title, developer_id, created_at, merged_at, status) 
        VALUES (?, ?, ?, ?, ?)
    `);

    const statuses = ['merged', 'open', 'closed'];
    
    const insertMRsTransaction = db.transaction(() => {
        for (let i = 1; i <= 35; i++) {
            const title = `Fix issue #${100 + i}`;
            const devId = activeDevIds[Math.floor(Math.random() * activeDevIds.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const createdAt = getRandomDate(40);
            
            let mergedAt: string | null = null;
            if (status === 'merged') {
                mergedAt = addHours(createdAt, Math.floor(Math.random() * 48) + 2);
            }

            insertMR.run(title, devId, createdAt, mergedAt, status);
        }
    });
    insertMRsTransaction();

    // 3. Insert at least 100 Commits (Generating 115)
    console.log("Inserting commits...");
    const insertCommit = db.prepare(`
        INSERT INTO commits (message, developer_id, merge_request_id, created_at) 
        VALUES (?, ?, ?, ?)
    `);

    const commitMessages = [
        "Refactor auth logic", 
        "Fix nasty production bug", 
        "Add missing unit tests", 
        "Update documentation", 
        "Typo fix", 
        "Optimize SQL queries"
    ];

    // Fetch the generated MR IDs to link them correctly
    const mrs = db.prepare("SELECT id FROM merge_requests").all() as { id: number }[];
    const mrIds = mrs.map(m => m.id);

    const insertCommitsTransaction = db.transaction(() => {
        for (let i = 1; i <= 115; i++) {
            const message = commitMessages[Math.floor(Math.random() * commitMessages.length)];
            const devId = activeDevIds[Math.floor(Math.random() * activeDevIds.length)];
            const mrId = mrIds[Math.floor(Math.random() * mrIds.length)];
            const createdAt = getRandomDate(40);

            insertCommit.run(message, devId, mrId, createdAt);
        }
    });
    insertCommitsTransaction();

    console.log("Successfully seeded staj.db using TypeScript!");

} catch (error) {
    console.error("An error occurred during seeding:", error);
} finally {
    db.close();
}