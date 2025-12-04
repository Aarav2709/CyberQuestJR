import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api, { type User, type Profile, type GamificationData } from '../lib/api';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  gamification: GamificationData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; username: string; password: string; displayName?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshGamification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [gamification, setGamification] = useState<GamificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = api.getToken();
    if (!token) {
      setUser(null);
      setProfile(null);
      setGamification(null);
      return;
    }

    const { data, error } = await api.getCurrentUser();
    if (error || !data) {
      api.setToken(null);
      setUser(null);
      setProfile(null);
      setGamification(null);
      return;
    }

    setUser(data.user);

    // Fetch profile and gamification data in parallel
    const [profileRes, gamificationRes] = await Promise.all([
      api.getProfile(),
      api.getGamification(),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (gamificationRes.data) setGamification(gamificationRes.data);
  }, []);

  const refreshGamification = useCallback(async () => {
    if (!user) return;
    const { data } = await api.getGamification();
    if (data) setGamification(data);
  }, [user]);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const { data, error } = await api.login({ email, password });
    if (error || !data) {
      return { success: false, error: error || 'Login failed' };
    }

    api.setToken(data.token);
    setUser(data.user);

    // Fetch additional data
    const [profileRes, gamificationRes] = await Promise.all([
      api.getProfile(),
      api.getGamification(),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (gamificationRes.data) setGamification(gamificationRes.data);

    return { success: true };
  };

  const register = async (data: { email: string; username: string; password: string; displayName?: string }) => {
    const { data: response, error } = await api.register(data);
    if (error || !response) {
      return { success: false, error: error || 'Registration failed' };
    }

    api.setToken(response.token);
    setUser(response.user);

    // Fetch additional data
    const [profileRes, gamificationRes] = await Promise.all([
      api.getProfile(),
      api.getGamification(),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (gamificationRes.data) setGamification(gamificationRes.data);

    return { success: true };
  };

  const logout = async () => {
    await api.logout();
    api.setToken(null);
    setUser(null);
    setProfile(null);
    setGamification(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        gamification,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        refreshGamification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
