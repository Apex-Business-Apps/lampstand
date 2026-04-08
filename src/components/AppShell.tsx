import { Home, Sun, BookOpen, MessageCircle, User } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  kidsMode?: boolean;
}

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/daily', icon: Sun, label: 'Daily' },
  { path: '/guidance', icon: MessageCircle, label: 'Guidance' },
  { path: '/saved', icon: BookOpen, label: 'Saved' },
  { path: '/settings', icon: User, label: 'Settings' },
];

export function AppShell({ children, kidsMode }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`min-h-screen flex flex-col ${kidsMode ? 'kids-mode' : ''}`}>
      <main className="flex-1 pb-24 md:pb-20 max-w-4xl mx-auto w-full">{children}</main>
      <footer className="px-4 pb-2 text-center text-xs text-muted-foreground">
        <div className="flex flex-wrap justify-center gap-3 py-2">
          <Link to="/legal/privacy">Privacy</Link>
          <Link to="/legal/terms">Terms</Link>
          <Link to="/legal/aup">AUP</Link>
          <Link to="/legal/disclaimer">Disclaimer</Link>
        </div>
      </footer>
      <nav className="fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur-md border-t border-border z-50 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        <div className="max-w-4xl mx-auto flex justify-around py-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
