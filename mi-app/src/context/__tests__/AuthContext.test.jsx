import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../AuthContext';
import { useAuth } from '../../hooks/useAuth';

// Mock de fetch
global.fetch = jest.fn();

// Componente de prueba para usar el contexto
const TestComponent = () => {
  const { user, token, login, logout, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.Nombre : 'No user'}</div>
      <div data-testid="token">{token || 'No token'}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not loading'}</div>
      <button onClick={() => login('test@test.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('proporciona valores iniciales correctos', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('token')).toHaveTextContent('No token');
    expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
  });

  test('maneja login exitoso', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        token: 'fake-token',
        usuario: { IdUsuario: 1, Nombre: 'Test User', Correo: 'test@test.com' }
      })
    };
    
    fetch.mockResolvedValueOnce(mockResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
      expect(screen.getByTestId('token')).toHaveTextContent('fake-token');
    });
  });

  test('maneja logout correctamente', async () => {
    // Simular usuario logueado
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ Nombre: 'Test User' }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByText('Logout');
    logoutButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
      expect(screen.getByTestId('token')).toHaveTextContent('No token');
    });

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
}); 