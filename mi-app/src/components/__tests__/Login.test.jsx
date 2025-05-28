import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../context/AuthContext';

// Mock del contexto de autenticación
const mockLogin = jest.fn();
const mockAuthContext = {
  login: mockLogin,
  user: null,
  token: null,
  loading: false
};

jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => mockAuthContext
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el formulario de login correctamente', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('muestra errores de validación para campos vacíos', async () => {
    renderWithProviders(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el correo es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument();
    });
  });

  test('valida formato de email', async () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/correo/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/formato de correo inválido/i)).toBeInTheDocument();
    });
  });

  test('envía el formulario con datos válidos', async () => {
    mockLogin.mockResolvedValue({ success: true });
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/correo/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123');
    });
  });
}); 