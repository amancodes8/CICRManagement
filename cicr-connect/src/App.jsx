/**
 * Main Application Component
 * 
 * Sets up routing, authentication, and global layout structure.
 * Manages protected routes and application-wide state.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Sidebar } from './components/shared/Sidebar';
import { CommandMenu } from './components/shared/CommandMenu';
import { PageSkeleton } from './components/shared/SkeletonLoader';

// Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import MeetingsPage from './pages/MeetingsPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';

import { ROUTES, USER_ROLES } from './lib/types';

/**
 * Protected Route Component
 * Redirects to auth page if user is not authenticated
 */
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <PageSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  // Check admin access
  if (adminOnly && user?.role !== USER_ROLES.ADMIN) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}

/**
 * Main Layout Component
 */
function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
      <CommandMenu />
    </div>
  );
}

/**
 * App Routes Component
 */
function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading CICR Connect...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={ROUTES.AUTH}
        element={
          isAuthenticated ? (
            <Navigate to={ROUTES.DASHBOARD} replace />
          ) : (
            <AuthPage />
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PROJECTS}
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProjectsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.MEETINGS}
        element={
          <ProtectedRoute>
            <MainLayout>
              <MeetingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ADMIN}
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <AdminPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Default Redirect */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.AUTH}
            replace
          />
        }
      />

      {/* 404 Not Found */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-primary">404</h1>
              <p className="mt-4 text-xl text-muted-foreground">Page not found</p>
              <a
                href={ROUTES.DASHBOARD}
                className="mt-6 inline-block text-primary hover:underline"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

/**
 * Main App Component
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;