import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { AuthProvider, useAuth } from '../hooks/useAuth';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Auth Components', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
    localStorage.clear();
  });

  describe('LoginForm', () => {
    it('renders login form properly', () => {
      renderWithProviders(<LoginForm />);
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('shows error on empty submission', async () => {
      renderWithProviders(<LoginForm />);
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
      expect(await screen.findByText(/please fill in all fields/i)).toBeInTheDocument();
    });

    it('calls API on submit', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'fake_jwt_token', name: 'Alice' })
      });
      
      renderWithProviders(<LoginForm />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@test.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/auth/login'), expect.any(Object));
      });
    });
  });

  describe('RegisterForm', () => {
    it('validates empty fields and format', async () => {
      renderWithProviders(<RegisterForm />);
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
      expect(await screen.findByText(/please fill in all fields/i)).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Alice' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
      
      expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@test.com' } });
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
      expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });
});
