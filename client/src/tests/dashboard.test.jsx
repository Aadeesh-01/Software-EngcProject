import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../hooks/useAuth';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard (ResumeList)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
    localStorage.setItem('token', 'fake-token');
    
    // Mock jwt decoding indirectly by mimicking the effect in useAuth if needed.
    // Or just let it do its thing and test rendering.
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('shows loading state initially', () => {
    global.fetch.mockImplementation(() => new Promise(() => {})); // hanging promise
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/loading resumes/i)).toBeInTheDocument();
  });

  it('shows empty state (only create button) when no resumes', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });
    
    renderWithProviders(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/create new resume/i)).toBeInTheDocument();
      expect(screen.queryByText(/loading resumes/i)).not.toBeInTheDocument();
    });
  });

  it('shows user resumes', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, title: 'Software Eng Resume', template: 'modern', updated_at: '2023-01-01T00:00:00Z' }
      ]
    });
    
    renderWithProviders(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Software Eng Resume')).toBeInTheDocument();
      expect(screen.getByText(/modern/i)).toBeInTheDocument();
    });
  });
});
