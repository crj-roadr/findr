import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App component', () => {
  render(<App />);
  // Check for something that likely exists or just that it renders without crashing
  // Vite template usually has "Vite + React" text
  const linkElement = screen.getByText(/Vite \+ React/i);
  expect(linkElement).toBeInTheDocument();
});
