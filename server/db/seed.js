import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, 'schema.sql');

// Read and execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

const users = [
  { name: 'Alice', email: 'alice@test.com', password: 'password123' },
  { name: 'Bob', email: 'bob@test.com', password: 'password123' },
  { name: 'Charlie', email: 'charlie@test.com', password: 'password123' }
];

const insertUser = db.prepare('INSERT OR IGNORE INTO users (name, email, password_hash) VALUES (?, ?, ?)');
const initialResume = JSON.stringify({
  personal: { fullName: '', email: '', phone: '', location: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: []
});
const insertResume = db.prepare('INSERT INTO resumes (user_id, title, template, data) VALUES (?, ?, ?, ?)');

console.log('Seeding database...');
db.transaction(() => {
  for (const user of users) {
    const hash = bcrypt.hashSync(user.password, 10);
    const result = insertUser.run(user.name, user.email, hash);
    if (result.changes > 0) {
      console.log(`User ${user.email} created.`);
      // Add a default resume for each seeded user
      insertResume.run(result.lastInsertRowid, `${user.name}'s Resume`, 'classic', initialResume);
    } else {
      console.log(`User ${user.email} already exists.`);
    }
  }
})();
console.log('Database seeding complete. You can inspect database.db');
