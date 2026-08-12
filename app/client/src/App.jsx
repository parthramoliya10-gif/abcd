import { AuthProvider } from './hooks/useAuth'
import { ToastProvider } from './Components/ui/Toast'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  )
}
