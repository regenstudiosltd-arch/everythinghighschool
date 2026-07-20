import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AppRole = "customer" | "admin" | "staff";

export type UserProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  role: AppRole;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
};

type SignUpInput = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<UserProfile | null>;
  signUp: (input: SignUpInput) => Promise<{ profile: UserProfile | null; message: string }>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<string>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const FALLBACK_CUSTOMER_PROFILE: UserProfile = {
  id: "",
  full_name: null,
  phone: null,
  email: null,
  role: "customer",
  avatar_url: null,
};

function normalizeProfile(profile: Partial<UserProfile> & { id: string }): UserProfile {
  return {
    id: profile.id,
    full_name: profile.full_name ?? null,
    phone: profile.phone ?? null,
    email: profile.email ?? null,
    role: (profile.role as AppRole) ?? "customer",
    avatar_url: profile.avatar_url ?? null,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  };
}

async function fetchProfile(userId: string, user: User | null): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, email, role, avatar_url, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (!error && data) {
    return normalizeProfile(data as UserProfile);
  }

  if (user) {
    return normalizeProfile({
      ...FALLBACK_CUSTOMER_PROFILE,
      id: user.id,
      full_name: (user.user_metadata?.full_name as string | undefined) ?? user.email ?? null,
      phone: (user.user_metadata?.phone as string | undefined) ?? null,
      email: user.email ?? null,
      avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    });
  }

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    const user = session?.user ?? null;
    if (!user) {
      setProfile(null);
      return;
    }

    const nextProfile = await fetchProfile(user.id, user);
    setProfile(nextProfile);
  };

  useEffect(() => {
    let mounted = true;

    const syncSession = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!mounted) return;

      if (sessionError) {
        setError(sessionError.message);
      }

      setSession(data.session ?? null);
      if (data.session?.user) {
        setProfile(await fetchProfile(data.session.user.id, data.session.user));
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    void syncSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return;

      setSession(nextSession);
      setLoading(false);
      setError(null);

      if (nextSession?.user) {
        setProfile(await fetchProfile(nextSession.user.id, nextSession.user));
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setActionLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        return null;
      }

      setSession(data.session ?? null);
      const nextProfile = data.user ? await fetchProfile(data.user.id, data.user) : null;
      setProfile(nextProfile);
      return nextProfile;
    } finally {
      setActionLoading(false);
    }
  };

  const signUp = async ({ fullName, phone, email, password }: SignUpInput) => {
    setActionLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return { profile: null, message: signUpError.message };
      }

      const nextProfile = data.user ? await fetchProfile(data.user.id, data.user) : null;
      setProfile(nextProfile);

      const message = data.session
        ? "Account created successfully."
        : "Account created. Check your email to confirm your registration.";

      return { profile: nextProfile, message };
    } finally {
      setActionLoading(false);
    }
  };

  const signOut = async () => {
    setActionLoading(true);
    setError(null);

    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError(signOutError.message);
        return;
      }

      setSession(null);
      setProfile(null);
    } finally {
      setActionLoading(false);
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    setActionLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#login`,
      });

      if (resetError) {
        setError(resetError.message);
        return resetError.message;
      }

      return "Password reset email sent. Check your inbox.";
    } finally {
      setActionLoading(false);
    }
  };

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    profile,
    loading,
    actionLoading,
    error,
    refreshProfile,
    signIn,
    signUp,
    signOut,
    sendPasswordResetEmail,
  }), [actionLoading, error, loading, profile, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
