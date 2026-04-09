import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"magic-link" | "login" | "signup">("login");
  const [password, setPassword] = useState("");

  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/" />;

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      toast.success("Magic link sent! Check your email.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send magic link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success("Signup successful! You can now login.");
      setMode("login");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (mode === "magic-link") handleMagicLink(e);
    else if (mode === "login") handleLogin(e);
    else handleSignup(e);
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto mt-12 p-6 bg-card rounded-lg shadow-md border">
        <h2 className="text-2xl font-serif font-bold text-center mb-6">
          {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Magic Link Sign In"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          {mode !== "magic-link" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : mode === "login" ? "Sign In" : mode === "signup" ? "Sign Up" : "Send Magic Link"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignIn}>
          Google
        </Button>


        <div className="mt-6 flex flex-col space-y-2 text-sm text-center">
          {mode === "login" ? (
            <>
              <button onClick={() => setMode("signup")} className="text-primary hover:underline">
                Need an account? Sign up
              </button>
              <button onClick={() => setMode("magic-link")} className="text-primary hover:underline">
                Use magic link instead
              </button>
            </>
          ) : mode === "signup" ? (
            <button onClick={() => setMode("login")} className="text-primary hover:underline">
              Already have an account? Sign in
            </button>
          ) : (
            <button onClick={() => setMode("login")} className="text-primary hover:underline">
              Back to regular sign in
            </button>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>You can also use Lampstand in Guest Mode without an account.</p>
          <Link to="/" className="text-primary hover:underline mt-1 inline-block">Continue as Guest</Link>
        </div>
      </div>
    </AppShell>
  );
};

export default AuthPage;
