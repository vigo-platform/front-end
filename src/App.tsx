import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRouter from './app/router'
import { AuthProvider } from './features/auth/context/AuthContext'
import LanguageSwitcher from './shared/components/LanguageSwitcher'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageSwitcher />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
