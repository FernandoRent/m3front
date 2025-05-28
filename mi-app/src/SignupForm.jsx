import { useState, useEffect } from 'react';

function SignupForm() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [form, setForm] = useState({ Nombre: '', Correo: '', Contrasena: '' });
  const [editando, setEditando] = useState(null); // IdUsuario del usuario en edición
  const [editForm, setEditForm] = useState({ Nombre: '', Correo: '', Contrasena: '' });
  const [modal, setModal] = useState(false);

  const BACKEND_URL = 'http://localhost:3000/api/usuarios';

  // Leer usuarios (GET)
  const fetchUsuarios = async () => {
    setCargando(true);
    try {
      const res = await fetch(BACKEND_URL);
      if (res.ok) {
        const data = await res.json();
        setUsuarios(Array.isArray(data) ? data : []);
      } else {
        setUsuarios([]);
      }
    } catch {
      setUsuarios([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Crear usuario (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setCargando(true);
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Nombre: form.Nombre,
          Correo: form.Correo,
          ContrasenaHash: form.Contrasena,
        }),
      });
      if (response.ok) {
        setMensaje('¡Usuario registrado con éxito!');
        setForm({ Nombre: '', Correo: '', Contrasena: '' });
        fetchUsuarios();
      } else {
        const data = await response.json();
        setMensaje(data?.error || 'Error al registrar usuario.');
      }
    } catch (error) {
      setMensaje('Error de red o del servidor.');
    } finally {
      setCargando(false);
    }
  };

  // Eliminar usuario (DELETE)
  const handleDelete = async (IdUsuario) => {
    if (!IdUsuario) {
      setMensaje('Error: ID de usuario no definido.');
      return;
    }
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    setMensaje('');
    setCargando(true);
    try {
      const res = await fetch(`${BACKEND_URL}/${IdUsuario}`, { method: 'DELETE' });
      if (res.ok) {
        setMensaje('Usuario eliminado.');
        fetchUsuarios();
      } else {
        setMensaje('Error al eliminar usuario.');
      }
    } catch {
      setMensaje('Error de red o del servidor.');
    } finally {
      setCargando(false);
    }
  };

  // Iniciar edición
  const handleEditInit = (usuario) => {
    setEditando(usuario.IdUsuario);
    setEditForm({ Nombre: usuario.Nombre, Correo: usuario.Correo, Contrasena: '' });
    setModal(true);
  };

  // Guardar edición (PUT)
  const handleEditSave = async (e) => {
    e.preventDefault();
    setMensaje('');
    setCargando(true);
    if (!editando) {
      setMensaje('Error: ID de usuario no definido.');
      setCargando(false);
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/${editando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Nombre: editForm.Nombre,
          Correo: editForm.Correo,
          ContrasenaHash: editForm.Contrasena,
        }),
      });
      if (res.ok) {
        setMensaje('Usuario actualizado.');
        setEditando(null);
        setModal(false);
        fetchUsuarios();
      } else {
        setMensaje('Error al actualizar usuario.');
      }
    } catch {
      setMensaje('Error de red o del servidor.');
    } finally {
      setCargando(false);
    }
  };

  // UI
  return (
    <div style={{ 
      width: '100%',
      fontFamily: 'system-ui'
    }}>
      {/* Formulario de registro */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            marginRight: '1rem'
          }}>
            ➕
          </div>
          <h3 style={{ 
            margin: 0, 
            color: '#1a202c',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            Agregar Nuevo Usuario
          </h3>
        </div>

        <form onSubmit={handleSubmit} style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'end'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#374151',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}>
              Nombre
            </label>
        <input
          type="text"
              placeholder="Nombre completo"
          value={form.Nombre}
          onChange={e => setForm(f => ({ ...f, Nombre: e.target.value }))}
          required
              style={{ 
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                backgroundColor: '#f8fafc'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f8fafc';
              }}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#374151',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}>
              Correo
            </label>
        <input
          type="email"
              placeholder="correo@ejemplo.com"
          value={form.Correo}
          onChange={e => setForm(f => ({ ...f, Correo: e.target.value }))}
          required
              style={{ 
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                backgroundColor: '#f8fafc'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f8fafc';
              }}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#374151',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}>
              Contraseña
            </label>
        <input
          type="password"
              placeholder="Contraseña segura"
          value={form.Contrasena}
          onChange={e => setForm(f => ({ ...f, Contrasena: e.target.value }))}
          required
              style={{ 
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                backgroundColor: '#f8fafc'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f8fafc';
              }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={cargando} 
            style={{ 
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              background: cargando ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: cargando ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: cargando ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => {
              if (!cargando) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (!cargando) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }
            }}
          >
            {cargando ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Guardando...
              </>
            ) : (
              <>
                ➕ Registrar
              </>
            )}
        </button>
      </form>

        {mensaje && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontWeight: '500',
            backgroundColor: mensaje.startsWith('¡') || mensaje.includes('eliminado') || mensaje.includes('actualizado') ? '#dcfce7' : '#fef2f2',
            color: mensaje.startsWith('¡') || mensaje.includes('eliminado') || mensaje.includes('actualizado') ? '#166534' : '#dc2626',
            border: `1px solid ${mensaje.startsWith('¡') || mensaje.includes('eliminado') || mensaje.includes('actualizado') ? '#bbf7d0' : '#fecaca'}`
          }}>
            {mensaje}
          </div>
        )}
      </div>

      {/* Lista de usuarios */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          padding: '1.5rem',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              marginRight: '1rem'
            }}>
              👥
            </div>
            <div>
              <h3 style={{ 
                margin: 0, 
                color: '#1a202c',
                fontSize: '1.3rem',
                fontWeight: '600'
              }}>
                Usuarios Registrados
              </h3>
              <p style={{
                margin: '0.2rem 0 0 0',
                color: '#64748b',
                fontSize: '0.9rem'
              }}>
                {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''} en total
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {cargando ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: '#64748b'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem auto'
              }}></div>
              Cargando usuarios...
            </div>
          ) : usuarios.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#64748b'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
              <p style={{ margin: 0, fontSize: '1.1rem' }}>No hay usuarios registrados</p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Agrega el primer usuario usando el formulario de arriba</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '1rem'
            }}>
              {usuarios.map(usuario => (
                <div 
                  key={usuario.IdUsuario} 
                  style={{
                    background: editando === usuario.IdUsuario ? '#f0f4ff' : '#f8fafc',
                    border: `2px solid ${editando === usuario.IdUsuario ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (editando !== usuario.IdUsuario) {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (editando !== usuario.IdUsuario) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: '1rem',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}>
                      {usuario.Nombre.charAt(0).toUpperCase()}
                    </div>
                    
                    <div>
                      <h4 style={{
                        margin: '0 0 0.25rem 0',
                        color: '#1a202c',
                        fontSize: '1.1rem',
                        fontWeight: '600'
                      }}>
                        {usuario.Nombre}
                      </h4>
                      <p style={{
                        margin: '0 0 0.25rem 0',
                        color: '#64748b',
                        fontSize: '0.9rem'
                      }}>
                        📧 {usuario.Correo}
                      </p>
                      <p style={{
                        margin: 0,
                        color: '#94a3b8',
                        fontSize: '0.8rem'
                      }}>
                        ID: #{usuario.IdUsuario}
                      </p>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem'
                    }}>
                      <button 
                        onClick={() => handleEditInit(usuario)} 
                        style={{ 
                          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.4)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(usuario.IdUsuario)} 
                        style={{ 
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      {modal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <form 
            onSubmit={handleEditSave} 
            style={{ 
              background: 'white',
              padding: '2rem',
              borderRadius: '20px',
              minWidth: '400px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid #e2e8f0'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                marginRight: '1rem'
              }}>
                ✏️
              </div>
              <h3 style={{
                margin: 0,
                color: '#1a202c',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                Editar Usuario
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '0.9rem'
                }}>
                  Nombre
                </label>
            <input
              type="text"
              placeholder="Nombre"
              value={editForm.Nombre}
              onChange={e => setEditForm(f => ({ ...f, Nombre: e.target.value }))}
              required
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8fafc'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.backgroundColor = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.backgroundColor = '#f8fafc';
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '0.9rem'
                }}>
                  Correo
                </label>
            <input
              type="email"
              placeholder="Correo"
              value={editForm.Correo}
              onChange={e => setEditForm(f => ({ ...f, Correo: e.target.value }))}
              required
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8fafc'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.backgroundColor = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.backgroundColor = '#f8fafc';
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '0.9rem'
                }}>
                  Nueva Contraseña (opcional)
                </label>
            <input
              type="password"
              placeholder="Nueva contraseña (opcional)"
              value={editForm.Contrasena}
              onChange={e => setEditForm(f => ({ ...f, Contrasena: e.target.value }))}
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8fafc'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.backgroundColor = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.backgroundColor = '#f8fafc';
                  }}
                />
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '1rem',
              marginTop: '2rem'
            }}>
              <button 
                type="button" 
                onClick={() => { setModal(false); setEditando(null); }} 
                style={{ 
                  background: '#e2e8f0',
                  color: '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#cbd5e1';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#e2e8f0';
                }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                }}
              >
                💾 Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default SignupForm; 