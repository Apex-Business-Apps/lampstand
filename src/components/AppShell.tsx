import {
  Home,
  Sun,
  BookOpen,
  MessageCircle,
  User,
  Sparkles,
  Flame,
  PenLine,
  Layers,
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthStatus } from './AuthStatus';

interface AppShellProps {
  children: ReactNode;
  kidsMode?: boolean;
}

const mobileNavItems = [
  { path: '/app', icon: Home, label: 'Home' },
  { path: '/daily', icon: Sun, label: 'Daily Light' },
  { path: '/guidance', icon: MessageCircle, label: 'Guidance' },
  { path: '/saved', icon: BookOpen, label: 'Saved' },
  { path: '/settings', icon: User, label: 'Settings' },
];

const desktopNavSections = [
  {
    title: 'Sanctuary',
    items: [
      { path: '/app', icon: Home, label: 'Home' },
      { path: '/daily', icon: Sun, label: 'Daily Light' },
      { path: '/guidance', icon: MessageCircle, label: 'Guidance' },
      { path: '/journal', icon: PenLine, label: 'Journal' },
    ],
  },
  {
    title: 'Disciplines',
    items: [
      { path: '/lectio', icon: BookOpen, label: 'Lectio Divina' },
      { path: '/examen', icon: Sparkles, label: 'Examen' },
      { path: '/sermon', icon: Flame, label: 'Sermon Mode' },
      { path: '/circles', icon: Layers, label: 'Prayer Circles' },
    ],
  },
  {
    title: 'Account',
    items: [
      { path: '/saved', icon: BookOpen, label: 'Saved Library' },
      { path: '/settings', icon: User, label: 'Settings' },
    ],
  },
];

export function AppShell({ children, kidsMode }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`min-h-screen flex ${kidsMode ? 'kids-mode' : ''} bg-background text-foreground`}>
      {/* Desktop Side Rail Navigation (md and above) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border/60 bg-card/40 backdrop-blur-xl z-40">
        <div className="p-5 border-b border-border/40 flex items-center">
          <Link to="/app" className="flex items-center">
            <img
              src="/images/wordmark-logo.png"
              alt="TheLampStand"
              className="h-8 w-auto object-contain"
              draggable={false}
            />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {desktopNavSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h3 className="px-3 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'bg-primary/15 text-primary shadow-sm font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <item.icon className={`h-4 w-4 shrink-0 ${active ? 'text-primary stroke-[2.5]' : ''}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border/40 space-y-3 bg-card/20">
          <div className="flex items-center justify-between">
            <AuthStatus />
          </div>
          <div className="flex items-center justify-center gap-2.5 text-[11px] text-muted-foreground/80 flex-wrap">
            <Link to="/legal/privacy" className="hover:text-foreground">Privacy</Link>
            <span>·</span>
            <Link to="/legal/terms" className="hover:text-foreground">Terms</Link>
            <span>·</span>
            <Link to="/legal/disclaimer" className="hover:text-foreground">AI Disclaimer</Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-64 w-full">
        {/* Mobile Header (Hidden on md) */}
        <header className="md:hidden flex justify-between items-center px-4 py-3 border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-30">
          <Link to="/app" className="flex items-center">
            <img
              src="/images/wordmark-logo.png"
              alt="TheLampStand"
              className="h-7 w-auto object-contain"
              draggable={false}
            />
          </Link>
          <AuthStatus />
        </header>

        {/* Main Body */}
        <main className="flex-1 max-w-lg md:max-w-3xl lg:max-w-4xl mx-auto w-full px-4 md:px-8 py-6 pb-24 md:pb-12">
          {children}
        </main>

        {/* Mobile Footer (Hidden on md) */}
        <footer className="md:hidden px-4 pb-24 pt-4 text-center text-xs text-muted-foreground border-t border-border/30">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/legal/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/legal/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/legal/acceptable-use" className="hover:text-foreground">AUP</Link>
            <Link to="/legal/disclaimer" className="hover:text-foreground">AI Disclaimer</Link>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation Bar (Hidden on md) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur-md border-t border-border z-50">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {mobileNavItems.map((item) => {
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
