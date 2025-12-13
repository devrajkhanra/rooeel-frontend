import { AuthProvider } from '@/contexts/auth-provider'
import { useAuth } from '@/hooks/use-auth'
import { LoginForm } from '@/components/login-form'
import { Dashboard } from '@/components/dashboard'
import { Toaster } from '@/components/ui/toaster'

function AppContent() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {user ? <Dashboard /> : <LoginForm />}
      </div>
      <Toaster />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App