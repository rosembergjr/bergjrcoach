const express = require('express');
const crypto = require('crypto');
const router = express.Router();
if (!!process.env.TURSO_DATABASE_URL !== !!process.env.TURSO_AUTH_TOKEN) {
 throw new Error('Configure TURSO_DATABASE_URL e TURSO_AUTH_TOKEN juntos.');
}
if (process.env.VERCEL && !process.env.TURSO_DATABASE_URL) {
 throw new Error('A publicação exige TURSO_DATABASE_URL e TURSO_AUTH_TOKEN.');
}
const remote = !!process.env.TURSO_DATABASE_URL;
const db = remote ? require('./remoteDb') : require('./db');
const insert = remote ? null : db.prepare('INSERT INTO leads (name,email,phone,goal,location,support,message,consent) VALUES (@name,@email,@phone,@goal,@location,@support,@message,1)');
function clean(value, max) { return typeof value === 'string' ? value.trim().slice(0,max + 1) : ''; }
router.post('/', async (req,res,next) => {
 try {
  const input = req.body || {};
  const name = clean(input.name,120);
  const email = clean(input.email,254).toLowerCase();
  const phone = clean(input.phone,30);
  const goal = clean(input.goal,300);
  const location = clean(input.location,120);
  const support = clean(input.support,120);
  const message = clean(input.message,2000);
  if (!name || name.length > 120 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) || email.length > 254 || !/^[+\d\s().-]{8,30}$/.test(phone) || !goal || goal.length > 300 || location.length > 120 || support.length > 120 || message.length > 2000 || input.consent !== true) {
   return res.status(400).json({ success:false, message:'Confira nome, telefone, objetivo e consentimento.' });
  }
  const lead = {name,email,phone,goal,location,support,message};
  const id = remote ? await db.insert(lead) : Number(insert.run(lead).lastInsertRowid);
  res.status(201).json({success:true,message:'Recebemos seu contato.',id});
 } catch(error) { next(error); }
});
router.get('/', async (req,res,next) => {
 try {
  const key = process.env.ADMIN_API_KEY;
  const supplied = req.get('x-admin-key') || '';
  if (!key || Buffer.byteLength(key) !== Buffer.byteLength(supplied) || !crypto.timingSafeEqual(Buffer.from(key),Buffer.from(supplied))) return res.status(401).json({success:false,message:'Não autorizado.'});
  const limit = Math.min(100,Math.max(1,Number.parseInt(req.query.limit,10) || 50));
  const offset = Math.max(0,Number.parseInt(req.query.offset,10) || 0);
  const result = remote ? await db.list(limit,offset) : {
   total:db.prepare('SELECT count(*) AS count FROM leads').get().count,
   leads:db.prepare('SELECT id,name,email,phone,goal,location,support,message,created_at FROM leads ORDER BY id DESC LIMIT ? OFFSET ?').all(limit,offset)
  };
  res.json({success:true,...result});
 } catch(error) { next(error); }
});
module.exports = router;
