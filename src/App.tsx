import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRouter from './app/router'
import { AuthProvider } from './features/auth/context/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App