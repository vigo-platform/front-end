import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRouter from './app/router'
import { AuthProvider } from './features/auth/context/AuthContext'
import { ThemeProvider } from './shared/theme/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
