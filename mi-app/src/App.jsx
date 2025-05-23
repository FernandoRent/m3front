import './App.css'
import SignupForm from './SignupForm'

function App() {
  return (
    <div style={{ 
      padding: '2rem',
      fontFamily: 'system-ui',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '10px',
        padding: '2rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Sistema de Gestión de Usuarios
        </h1>
        <SignupForm />
      </div>
    </div>
  )
}

export default App
