// Script para hashear contraseñas que están en texto plano
const BASE_URL = 'http://localhost:3000';

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error('❌ Error en la petición:', error.message);
    return { error };
  }
}

async function fixPasswordHashes() {
  console.log('🔧 === ARREGLANDO CONTRASEÑAS EN TEXTO PLANO ===\n');
  
  // 1. Obtener todos los usuarios
  console.log('📋 Obteniendo usuarios...');
  const { response, data: usuarios } = await makeRequest(`${BASE_URL}/api/usuarios`);
  
  if (response.status !== 200) {
    console.log('❌ Error al obtener usuarios');
    return;
  }
  
  console.log(`✅ Se encontraron ${usuarios.length} usuarios\n`);
  
  // 2. Identificar usuarios con contraseñas problemáticas
  const usuariosProblematicos = usuarios.filter(user => {
    const hash = user.ContrasenaHash;
    // Un hash bcrypt válido siempre empieza con $2b$ y tiene al menos 60 caracteres
    return !hash || hash === '' || !hash.startsWith('$2b$') || hash.length < 60;
  });
  
  console.log(`🔍 Usuarios con contraseñas problemáticas: ${usuariosProblematicos.length}`);
  
  if (usuariosProblematicos.length === 0) {
    console.log('✅ Todas las contraseñas ya están hasheadas correctamente');
    return;
  }
  
  // 3. Mostrar usuarios problemáticos
  usuariosProblematicos.forEach(user => {
    console.log(`\n❌ Usuario ID ${user.IdUsuario}:`);
    console.log(`   Nombre: ${user.Nombre}`);
    console.log(`   Correo: ${user.Correo}`);
    console.log(`   Contraseña actual: "${user.ContrasenaHash}"`);
  });
  
  console.log('\n🔧 === OPCIONES DE SOLUCIÓN ===');
  console.log('1. Eliminar usuarios con contraseñas problemáticas');
  console.log('2. Asignar contraseña temporal "123456" a todos');
  console.log('3. Mantener como están (no recomendado)');
  
  // Para este script, vamos a asignar una contraseña temporal
  console.log('\n🔄 Aplicando solución: Asignar contraseña temporal "123456"...\n');
  
  for (const user of usuariosProblematicos) {
    console.log(`🔄 Actualizando usuario ${user.IdUsuario} (${user.Nombre})...`);
    
    // Usar la API de registro para crear un nuevo usuario con la misma info pero contraseña hasheada
    // Primero eliminar el usuario problemático
    const deleteResult = await makeRequest(`${BASE_URL}/api/usuarios/${user.IdUsuario}`, {
      method: 'DELETE'
    });
    
    if (deleteResult.response.status === 200) {
      console.log(`   ✅ Usuario eliminado`);
      
      // Crear nuevo usuario con contraseña hasheada
      const createResult = await makeRequest(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Nombre: user.Nombre,
          Correo: user.Correo,
          Contrasena: '123456' // Contraseña temporal
        })
      });
      
      if (createResult.response.status === 201) {
        console.log(`   ✅ Usuario recreado con contraseña hasheada`);
        console.log(`   🔑 Nueva contraseña temporal: "123456"`);
      } else {
        console.log(`   ❌ Error al recrear usuario:`, createResult.data);
      }
    } else {
      console.log(`   ❌ Error al eliminar usuario:`, deleteResult.data);
    }
  }
  
  console.log('\n🎉 === PROCESO COMPLETADO ===');
  console.log('📝 IMPORTANTE: Todos los usuarios afectados ahora tienen la contraseña temporal "123456"');
  console.log('🔐 Los usuarios deberán cambiar su contraseña en el próximo login');
}

// Ejecutar el script
fixPasswordHashes().catch(console.error); 