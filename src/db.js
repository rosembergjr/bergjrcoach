const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const dir = path.join(__dirname, '..', 'database');
fs.mkdirSync(dir, { recursive: true });
const db = new Database(path.join(dir, 'leads.sqlite'));
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS leads (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 email TEXT NOT NULL,
 phone TEXT NOT NULL,
 goal TEXT NOT NULL,
 location TEXT NOT NULL DEFAULT '',
 support TEXT NOT NULL DEFAULT '',
 message TEXT NOT NULL DEFAULT '',
 consent INTEGER NOT NULL CHECK(consent = 1),
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);
for (const column of ['location', 'support']) {
 if (!db.prepare('PRAGMA table_info(leads)').all().some(row => row.name === column)) {
  db.exec(`ALTER TABLE leads ADD COLUMN ${column} TEXT NOT NULL DEFAULT ''`);
 }
}
module.exports = db;
