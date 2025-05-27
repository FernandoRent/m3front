import { useAuth } from '../context/AuthContext';
import SignupForm from '../SignupForm';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: 'system-ui',
      margin: 0,
      padding: 0
    }}>
      {/* Header moderno */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1.5rem 0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              🏠
            </div>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: 'clamp(1.5rem, 3vw, 1.8rem)',
                fontWeight: '700'
              }}>
                Dashboard
              </h1>
              <p style={{ 
                margin: '0.2rem 0 0 0', 
                opacity: 0.9,
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}>
                Bienvenido, <strong>{user?.Nombre}</strong>
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              wordBreak: 'break-word'
            }}>
              {user?.Correo}
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Tarjeta de información del usuario */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem'
            }}>
              👤
            </div>
            <div>
              <h2 style={{ 
                margin: 0, 
                color: '#1a202c',
                fontSize: 'clamp(1.3rem, 3vw, 1.5rem)',
                fontWeight: '600'
              }}>
                Información de tu Cuenta
              </h2>
              <p style={{
                margin: '0.2rem 0 0 0',
                color: '#64748b',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}>
                Detalles de tu perfil de usuario
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>🆔</span>
                <strong style={{ color: '#374151', fontSize: '0.9rem' }}>ID de Usuario</strong>
              </div>
              <p style={{ 
                margin: 0, 
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#1a202c'
              }}>
                #{user?.IdUsuario}
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>👨‍💼</span>
                <strong style={{ color: '#374151', fontSize: '0.9rem' }}>Nombre Completo</strong>
              </div>
              <p style={{ 
                margin: 0, 
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#1a202c'
              }}>
                {user?.Nombre}
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>📧</span>
                <strong style={{ color: '#374151', fontSize: '0.9rem' }}>Correo Electrónico</strong>
              </div>
              <p style={{ 
                margin: 0, 
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#1a202c',
                wordBreak: 'break-word'
              }}>
                {user?.Correo}
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>📅</span>
                <strong style={{ color: '#374151', fontSize: '0.9rem' }}>Fecha de Registro</strong>
              </div>
              <p style={{ 
                margin: 0, 
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#1a202c'
              }}>
                {user?.FechaCreacion ? new Date(user.FechaCreacion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'No disponible'}
              </p>
            </div>
          </div>
        </div>

        {/* Sección CRUD */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #f1f5f9',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem'
            }}>
              🛠️
            </div>
            <div>
              <h2 style={{ 
                margin: 0, 
                color: '#1a202c',
                fontSize: 'clamp(1.5rem, 3vw, 1.8rem)',
                fontWeight: '600'
              }}>
                Gestión de Usuarios
              </h2>
              <p style={{
                margin: '0.2rem 0 0 0',
                color: '#64748b',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}>
                Operaciones CRUD completas para administrar usuarios
              </p>
            </div>
          </div>
          
          <div style={{
            background: '#f8fafc',
            borderRadius: '15px',
            padding: '1.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <SignupForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 