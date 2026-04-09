import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AuthStatus() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="gap-2">
        <User className="h-4 w-4" /> Sign In
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 text-muted-foreground hover:text-foreground">
      <LogOut className="h-4 w-4" /> Sign Out
    </Button>
  );
}
