import { useNavigate, useLocation, Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthStatus } from './AuthStatus';
import { ChapelMini, LampMini, DoveMini, BookMini, SoulMini } from '@/components/brand/SacredIcons';

interface AppShellProps {
  children: ReactNode;
  kidsMode?: boolean;
}

const navItems = [
  { path: '/app', icon: ChapelMini, label: 'Home' },
  { path: '/daily', icon: LampMini, label: 'Daily Light' },
  { path: '/guidance', icon: DoveMini, label: 'Guidance' },
  { path: '/saved', icon: BookMini, label: 'Saved' },
  { path: '/settings', icon: SoulMini, label: 'Settings' },
];

export function AppShell({ children, kidsMode }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`min-h-screen flex flex-col ${kidsMode ? 'kids-mode' : ''}`}>
      <header className="absolute top-0 w-full flex justify-end p-4 z-50">
         <AuthStatus />
      </header>
      <main className="flex-1 pb-20 max-w-lg mx-auto w-full pt-6">
        {children}
      </main>
      <footer className="px-4 pb-24 pt-6 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/legal/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/legal/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/legal/acceptable-use" className="hover:text-foreground">AUP</Link>
          <Link to="/legal/disclaimer" className="hover:text-foreground">AI Disclaimer</Link>
        </div>
      </footer>
      <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-[hsl(var(--sacred-gold)/0.25)] bg-card/95 backdrop-blur-md shadow-[0_-10px_36px_-18px_hsl(var(--warm-glow)/0.45)] safe-bottom">
        <div className="max-w-lg mx-auto flex justify-around px-2 py-2">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-b from-[hsl(var(--sacred-gold-soft))] to-[hsl(var(--warm-glow-soft))] text-[hsl(var(--ember))] shadow-[0_2px_10px_-4px_hsl(var(--warm-glow)/0.5)]'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
              >
                <item.icon className={`h-5 w-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
                <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`} style={{ fontFamily: 'var(--font-ui)' }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
