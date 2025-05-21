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
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'system-ui' }}>
      <h2 style={{ textAlign: 'center' }}>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Nombre"
          value={form.Nombre}
          onChange={e => setForm(f => ({ ...f, Nombre: e.target.value }))}
          required
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 120 }}
        />
        <input
          type="email"
          placeholder="Correo"
          value={form.Correo}
          onChange={e => setForm(f => ({ ...f, Correo: e.target.value }))}
          required
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 180 }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.Contrasena}
          onChange={e => setForm(f => ({ ...f, Contrasena: e.target.value }))}
          required
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 140 }}
        />
        <button type="submit" disabled={cargando} style={{ padding: '8px 18px', borderRadius: 6, background: '#646cff', color: '#fff', border: 'none', fontWeight: 600 }}>
          {cargando ? 'Guardando...' : 'Registrar'}
        </button>
      </form>
      {mensaje && <div style={{ textAlign: 'center', marginBottom: 16, color: mensaje.startsWith('¡') || mensaje.includes('eliminado') || mensaje.includes('actualizado') ? 'green' : 'red' }}>{mensaje}</div>}
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 16 }}>
        <h3 style={{ margin: '0 0 12px 0', textAlign: 'center' }}>Usuarios Registrados</h3>
        {cargando ? <div style={{ textAlign: 'center', padding: 20 }}>Cargando...</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
            <thead>
              <tr style={{ background: '#f6f6ff' }}>
                <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Nombre</th>
                <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Correo</th>
                <th style={{ padding: 8, borderBottom: '1px solid #eee' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: 16 }}>No hay usuarios registrados.</td></tr>
              )}
              {usuarios.map(usuario => (
                <tr key={usuario.IdUsuario} style={{ background: editando === usuario.IdUsuario ? '#eaf0ff' : 'transparent' }}>
                  <td style={{ padding: 8 }}>{usuario.Nombre}</td>
                  <td style={{ padding: 8 }}>{usuario.Correo}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => handleEditInit(usuario)} style={{ marginRight: 8, background: '#ffd700', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => handleDelete(usuario.IdUsuario)} style={{ background: '#ff6464', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Modal de edición */}
      {modal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleEditSave} style={{ background: '#fff', padding: 32, borderRadius: 10, minWidth: 320, boxShadow: '0 2px 16px #0003', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3>Editar Usuario</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={editForm.Nombre}
              onChange={e => setEditForm(f => ({ ...f, Nombre: e.target.value }))}
              required
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
            <input
              type="email"
              placeholder="Correo"
              value={editForm.Correo}
              onChange={e => setEditForm(f => ({ ...f, Correo: e.target.value }))}
              required
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
            <input
              type="password"
              placeholder="Nueva contraseña (opcional)"
              value={editForm.Contrasena}
              onChange={e => setEditForm(f => ({ ...f, Contrasena: e.target.value }))}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={() => { setModal(false); setEditando(null); }} style={{ background: '#ccc', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }}>Cancelar</button>
              <button type="submit" style={{ background: '#646cff', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer' }}>Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default SignupForm; 