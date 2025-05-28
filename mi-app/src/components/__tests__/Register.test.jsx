import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../Register';
import { AuthProvider } from '../../context/AuthContext';

// Mock del contexto de autenticación
const mockRegister = jest.fn();
const mockAuthContext = {
  register: mockRegister,
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

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el formulario de registro correctamente', () => {
    renderWithProviders(<Register />);
    
    expect(screen.getByText('Crear Cuenta')).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  test('valida que las contraseñas coincidan', async () => {
    renderWithProviders(<Register />);
    
    const passwordInput = screen.getByLabelText(/^contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /registrarse/i });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  test('envía el formulario con datos válidos', async () => {
    mockRegister.mockResolvedValue({ success: true });
    renderWithProviders(<Register />);
    
    const nameInput = screen.getByLabelText(/nombre/i);
    const emailInput = screen.getByLabelText(/correo/i);
    const passwordInput = screen.getByLabelText(/^contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /registrarse/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('Test User', 'test@test.com', 'password123');
    });
  });
}); 