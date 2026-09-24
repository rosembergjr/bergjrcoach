const { createClient } = require('@libsql/client');
const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url || !authToken) throw new Error('Configure TURSO_DATABASE_URL e TURSO_AUTH_TOKEN juntos.');
const client = createClient({ url, authToken });
let ready;
function init() {
 if (!ready) ready = client.execute(`CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  goal TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  support TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  consent INTEGER NOT NULL CHECK(consent = 1),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
 )`).catch(error => { ready = undefined; throw error; });
 return ready;
}
module.exports = {
 async insert(lead) {
  await init();
  const result = await client.execute({ sql:'INSERT INTO leads (name,email,phone,goal,location,support,message,consent) VALUES (?,?,?,?,?,?,?,1)', args:[lead.name,lead.email,lead.phone,lead.goal,lead.location,lead.support,lead.message] });
  return Number(result.lastInsertRowid);
 },
 async list(limit,offset) {
  await init();
  const [count,rows] = await Promise.all([
   client.execute('SELECT count(*) AS count FROM leads'),
   client.execute({ sql:'SELECT id,name,email,phone,goal,location,support,message,created_at FROM leads ORDER BY id DESC LIMIT ? OFFSET ?',args:[limit,offset] })
  ]);
  return { total:Number(count.rows[0].count), leads:rows.rows.map(row => ({...row})) };
 }
};
