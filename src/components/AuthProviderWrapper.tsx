import { AuthProvider } from "@/contexts/AuthContext";

export const AuthProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
