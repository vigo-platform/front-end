import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import LoginPage from '../features/auth/pages/LoginPage'


function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<div>Register Page</div>} />
      <Route
        path="/forgot-password"
        element={<div>Forgot Password Page</div>}
      />

      <Route path="/dashboard" element={<DashboardPage />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRouter