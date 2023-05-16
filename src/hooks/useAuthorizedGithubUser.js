import { useSupabaseClient,useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export function useAuthorizedGithubUser() {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  async function signIn() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "github",
    });
  }

  async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    setIsAuthenticated(false);
  }

  async function checkUser() {
    const { data, error } = await supabaseClient
      .from("authorized-users")
      .select()
      .eq("email", user.email)
      .single();

    if (!data || error) {
      setIsAuthenticated(false);
      await signOut();
      return alert("Your GitHub user is not authorized to access this application. Please authorize this application using your Bio Github.")
    }

    setIsAuthenticated(true);
    setLoading(false);
  }

  return {
    user,
    isAuthenticated,
    signIn,
    signOut,
    checkUser,
    loading
  };
}