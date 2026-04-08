import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import resumeRoutes from '../../../server/routes/resumes.js';
import db from '../../../server/db/db.js';

vi.mock('../../../server/middleware/auth.js', () => ({
  requireAuth: (req, res, next) => {
    req.user = { userId: 1, name: 'Alice' };
    next();
  }
}));

vi.mock('../../../server/db/db.js', () => ({
  default: {
    prepare: vi.fn(),
  }
}));

const app = express();
app.use(express.json());
app.use('/api/resumes', resumeRoutes);

describe('API Routes: Resumes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/resumes should return user resumes', async () => {
    const mockResumes = [
      { id: 1, title: 'Test', template: 'classic', updated_at: '2023-01-01' }
    ];
    
    db.prepare.mockReturnValueOnce({
      all: vi.fn().mockReturnValue(mockResumes)
    });

    const res = await request(app).get('/api/resumes');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResumes);
    expect(db.prepare).toHaveBeenCalledWith(expect.stringContaining('SELECT id, title'));
  });

  it('POST /api/resumes should create a new resume', async () => {
    db.prepare.mockReturnValueOnce({
      run: vi.fn().mockReturnValue({ lastInsertRowid: 42 })
    });

    const res = await request(app)
      .post('/api/resumes')
      .send({ title: 'New Resume', template: 'modern' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 42, title: 'New Resume', template: 'modern' });
    expect(db.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO resumes'));
  });
});
