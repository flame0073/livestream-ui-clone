import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (error) {
      console.error("Failed to check admin role", error);
      return false;
    }

    return !!data;
  };

  useEffect(() => {
    let mounted = true;
    let requestId = 0;

    const syncAuthState = async (session: Session | null) => {
      const currentRequestId = ++requestId;
      const currentUser = session?.user ?? null;

      if (!mounted) return;
      setUser(currentUser);

      if (!currentUser) {
        if (currentRequestId === requestId) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      const admin = await checkAdminRole(currentUser.id);

      if (!mounted || currentRequestId !== requestId) return;

      setIsAdmin(admin);
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setLoading(true);
      void syncAuthState(session);
    });

    void supabase.auth.getSession().then(({ data: { session } }) => {
      void syncAuthState(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, isAdmin, loading, signUp, signIn, signOut };
};
