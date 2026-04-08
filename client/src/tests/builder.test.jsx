import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResumeEditor from '../components/builder/ResumeEditor';
import Classic from '../components/templates/Classic';
import Modern from '../components/templates/Modern';
import Minimal from '../components/templates/Minimal';

const mockData = {
  personal: { fullName: 'Alice Smith', email: 'alice@test.com', phone: '1234567890', location: 'NY' },
  summary: 'Great developer',
  experience: [{ company: 'Tech Inc', position: 'Dev', duration: '2020-2022', description: 'Coded stuff' }],
  education: [],
  skills: [{ name: 'React' }, { name: 'Node' }],
  projects: [],
  certifications: []
};

describe('Builder Components', () => {
  describe('ResumeEditor', () => {
    it('updates fields and calls onChange', () => {
      const onChange = vi.fn();
      render(<ResumeEditor data={mockData} onChange={onChange} />);
      
      // Personal Info should be default open
      const nameInput = screen.getByDisplayValue('Alice Smith');
      fireEvent.change(nameInput, { target: { value: 'Alice Jones' } });
      expect(onChange).toHaveBeenCalled();
    });

    it('adds and removes experience entries', () => {
      const onChange = vi.fn();
      render(<ResumeEditor data={mockData} onChange={onChange} />);
      
      // Open experience section
      fireEvent.click(screen.getByText('Work Experience'));
      
      const addButton = screen.getByText(/add experience/i);
      fireEvent.click(addButton);
      
      // It should call onChange with a new empty experience
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
        experience: expect.arrayContaining([
          expect.objectContaining({ company: '', position: '' })
        ])
      }));
    });
  });

  describe('Templates', () => {
    it('Classic renders correctly', () => {
      render(<Classic data={mockData} />);
      expect(screen.getByTestId('template-classic')).toBeInTheDocument();
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('Great developer')).toBeInTheDocument();
    });

    it('Modern renders correctly', () => {
      render(<Modern data={mockData} />);
      expect(screen.getByTestId('template-modern')).toBeInTheDocument();
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('Tech Inc')).toBeInTheDocument();
    });

    it('Minimal renders skills chips correctly', () => {
      render(<Minimal data={mockData} />);
      expect(screen.getByTestId('template-minimal')).toBeInTheDocument();
      expect(screen.getByTestId('skill-chip-0')).toHaveTextContent('React');
      expect(screen.getByTestId('skill-chip-1')).toHaveTextContent('Node');
    });
  });
});
