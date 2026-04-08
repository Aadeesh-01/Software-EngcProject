import express from 'express';
import db from '../db/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

const initialResume = {
  personal: { fullName: '', email: '', phone: '', location: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: []
};

// Get all resumes for current user
router.get('/', (req, res) => {
  const stmt = db.prepare('SELECT id, title, template, updated_at FROM resumes WHERE user_id = ? ORDER BY updated_at DESC');
  const resumes = stmt.all(req.user.userId);
  res.json(resumes);
});

// Get a specific resume
router.get('/:id', (req, res) => {
  const stmt = db.prepare('SELECT * FROM resumes WHERE id = ? AND user_id = ?');
  const resume = stmt.get(req.params.id, req.user.userId);
  
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  res.json({
    ...resume,
    data: JSON.parse(resume.data)
  });
});

// Create a new resume
router.post('/', (req, res) => {
  const { title, template = 'classic' } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title required' });
  }

  const stmt = db.prepare('INSERT INTO resumes (user_id, title, template, data) VALUES (?, ?, ?, ?)');
  const info = stmt.run(req.user.userId, title, template, JSON.stringify(initialResume));

  res.status(201).json({ id: info.lastInsertRowid, title, template });
});

// Update an existing resume
router.put('/:id', (req, res) => {
  const { title, template, data } = req.body;
  const stmt = db.prepare('UPDATE resumes SET title = COALESCE(?, title), template = COALESCE(?, template), data = COALESCE(?, data), updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?');
  
  const info = stmt.run(title, template, data ? JSON.stringify(data) : null, req.params.id, req.user.userId);
  
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Resume not found or not owned by user' });
  }
  
  res.json({ success: true });
});

// Duplicate a resume
router.post('/:id/duplicate', (req, res) => {
  // First, find the resume
  const stmt = db.prepare('SELECT * FROM resumes WHERE id = ? AND user_id = ?');
  const resume = stmt.get(req.params.id, req.user.userId);
  
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  
  const insertStmt = db.prepare('INSERT INTO resumes (user_id, title, template, data) VALUES (?, ?, ?, ?)');
  const info = insertStmt.run(req.user.userId, `${resume.title} (Copy)`, resume.template, resume.data);
  
  res.status(201).json({ id: info.lastInsertRowid });
});

// Delete a resume
router.delete('/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM resumes WHERE id = ? AND user_id = ?');
  const info = stmt.run(req.params.id, req.user.userId);
  
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Resume not found or not owned by user' });
  }
  
  res.json({ success: true });
});

export default router;
