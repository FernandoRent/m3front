import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../AuthContext';
import { useAuth } from '../../hooks/useAuth';

// Mock de fetch
global.fetch = jest.fn();

// Componente de prueba para usar el contexto
const TestComponent = () => {
  const { user, token, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.Nombre : 'No user'}</div>
      <div data-testid="token">{token || 'No token'}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not loading'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('proporciona valores iniciales correctos', async () => {
    // Mock fetch para que falle la verificación del token
    fetch.mockRejectedValue(new Error('Network error'));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Esperar a que termine la carga inicial
    await screen.findByText('Not loading');
    
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('token')).toHaveTextContent('No token');
    expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
  });
}); 