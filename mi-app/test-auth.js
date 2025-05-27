// Script de prueba para verificar las APIs de autenticación
const BASE_URL = 'http://localhost:3000';

// Función para hacer peticiones
async function makeRequest(url, options = {}) {
  try {
    console.log(`\n🔄 Haciendo petición a: ${url}`);
    console.log('📤 Opciones:', JSON.stringify(options, null, 2));
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log('📥 Respuesta:', JSON.stringify(data, null, 2));
    
    return { response, data };
  } catch (error) {
    console.error('❌ Error en la petición:', error.message);
    return { error };
  }
}

// Test 1: Verificar que el servidor esté corriendo
async function testServerHealth() {
  console.log('\n🏥 === TEST 1: VERIFICAR SERVIDOR ===');
  const { response, data, error } = await makeRequest(`${BASE_URL}/api/usuarios`);
  
  if (error) {
    console.log('❌ El servidor no está corriendo en el puerto 3000');
    return false;
  }
  
  console.log('✅ Servidor funcionando correctamente');
  return true;
}

// Test 2: Registrar un usuario de prueba
async function testRegister() {
  console.log('\n📝 === TEST 2: REGISTRO DE USUARIO ===');
  
  const testUser = {
    Nombre: 'Usuario Test',
    Correo: 'test@test.com',
    Contrasena: 'test123456'
  };
  
  const { response, data } = await makeRequest(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(testUser)
  });
  
  if (response.status === 201) {
    console.log('✅ Usuario registrado exitosamente');
    return testUser;
  } else if (response.status === 400 && data.message?.includes('ya existe')) {
    console.log('⚠️ Usuario ya existe, continuando con las pruebas...');
    return testUser;
  } else {
    console.log('❌ Error en el registro');
    return null;
  }
}

// Test 3: Intentar login con el usuario
async function testLogin(user) {
  console.log('\n🔐 === TEST 3: LOGIN DE USUARIO ===');
  
  const loginData = {
    Correo: user.Correo,
    Contrasena: user.Contrasena
  };
  
  const { response, data } = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  });
  
  if (response.status === 200 && data.token) {
    console.log('✅ Login exitoso');
    console.log('🎫 Token recibido:', data.token.substring(0, 50) + '...');
    return data.token;
  } else {
    console.log('❌ Error en el login');
    return null;
  }
}

// Test 4: Verificar token
async function testVerifyToken(token) {
  console.log('\n🔍 === TEST 4: VERIFICAR TOKEN ===');
  
  const { response, data } = await makeRequest(`${BASE_URL}/api/auth/verify`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 200) {
    console.log('✅ Token válido');
    return true;
  } else {
    console.log('❌ Token inválido');
    return false;
  }
}

// Test 5: Verificar usuarios en la base de datos
async function testGetUsers() {
  console.log('\n👥 === TEST 5: VERIFICAR USUARIOS EN BD ===');
  
  const { response, data } = await makeRequest(`${BASE_URL}/api/usuarios`);
  
  if (response.status === 200) {
    console.log(`✅ Se encontraron ${data.length} usuarios en la base de datos`);
    
    // Mostrar algunos usuarios para verificar el hash de contraseñas
    data.slice(0, 3).forEach((user, index) => {
      console.log(`\n👤 Usuario ${index + 1}:`);
      console.log(`   ID: ${user.IdUsuario}`);
      console.log(`   Nombre: ${user.Nombre}`);
      console.log(`   Correo: ${user.Correo}`);
      console.log(`   Contraseña Hash: ${user.ContrasenaHash ? user.ContrasenaHash.substring(0, 20) + '...' : 'NO HASH'}`);
      console.log(`   Fecha: ${user.FechaCreacion}`);
    });
    
    return data;
  } else {
    console.log('❌ Error al obtener usuarios');
    return [];
  }
}

// Ejecutar todas las pruebas
async function runAllTests() {
  console.log('🚀 === INICIANDO PRUEBAS DE AUTENTICACIÓN ===');
  
  // Test 1: Servidor
  const serverOk = await testServerHealth();
  if (!serverOk) {
    console.log('\n❌ PRUEBAS CANCELADAS: Servidor no disponible');
    return;
  }
  
  // Test 5: Verificar usuarios existentes
  await testGetUsers();
  
  // Test 2: Registro
  const testUser = await testRegister();
  if (!testUser) {
    console.log('\n❌ PRUEBAS CANCELADAS: Error en registro');
    return;
  }
  
  // Test 3: Login
  const token = await testLogin(testUser);
  if (!token) {
    console.log('\n❌ PRUEBAS CANCELADAS: Error en login');
    return;
  }
  
  // Test 4: Verificar token
  await testVerifyToken(token);
  
  console.log('\n🎉 === PRUEBAS COMPLETADAS ===');
}

// Ejecutar las pruebas
runAllTests().catch(console.error); 