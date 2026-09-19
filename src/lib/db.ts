import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');
const db = new Database(dbPath);

// Initialize tables automatically
db.exec(`
  CREATE TABLE IF NOT EXISTS civic_reports (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    description TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    status TEXT DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS checkpost_passes (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    corridor TEXT NOT NULL,
    status TEXT DEFAULT 'VALID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;