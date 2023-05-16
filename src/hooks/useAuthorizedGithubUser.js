import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { supabaseAdminClient } from '../../lib/supabaseClient';

export function useAuthorizedGithubUser() {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function signIn() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
    });
  }

  async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    setIsAuthenticated(false);
  }

  async function checkUser(userToCheck, event) {
    const { data, error } = await supabaseClient
      .from('authorized-users')
      .select()
      .eq('email', userToCheck.email)
      .single();

    if (!data) {
      setIsAuthenticated(false);
      const { data, error } = await supabaseAdminClient.auth.admin.deleteUser(
        userToCheck.id
      );
      await signOut();
      console.log({ data, error });

      if (event === 'SIGNED_IN') {
        alert(
          'Your GitHub user is not authorized to access this application. Please authorize this application using your Bio Github.'
        );
      } 
      return;
    }

    setIsAuthenticated(true);
  }

  return {
    user,
    isAuthenticated,
    signIn,
    signOut,
    checkUser,
  };
}
