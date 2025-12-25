import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Dashboard } from '@/pages/Dashboard';

const Index = () => {
  const { user, isLoading, login, logout, updateUser, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginForm onLogin={login} />;
  }

  return <Dashboard user={user} onLogout={logout} onUpdateUser={updateUser} />;
};

export default Index;
