import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { UserListPage } from './pages/user/UserListPage';
import { MyRequestsPage } from './pages/user/MyRequestsPage';
import { AdminEditPage } from './pages/admin/AdminEditPage';
import { AdminRequestsPage } from './pages/admin/AdminRequestsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoggerTest } from './components/LoggerTest';
import { TokenDebugger } from './components/TokenDebugger';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/users" element={<UserListPage />} />
              <Route path="/my-requests" element={<MyRequestsPage />} />
              <Route path="/admin/:id/edit" element={<AdminEditPage />} />
              <Route path="/admin/requests" element={<AdminRequestsPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Debug Components (only in development) */}
        {import.meta.env.DEV && (
          <>
            <LoggerTest />
            <TokenDebugger />
          </>
        )}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
