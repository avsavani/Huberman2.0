import { createClient } from "@/utils/supabase/server";

// Add this type definition
type UserProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  // Add any other fields that are part of the user profile
};

export class UserService {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  async getCurrentUser(): Promise<{ user: UserProfile, session }> {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    if (error || !user) {
      return { user: null, session: null }
    }

    const { data: profile, error: profileError } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      return { user: null, session: null }
    }

    const userProfile: UserProfile = {
      id: user.id,
      email: user.email || '',
      first_name: profile?.first_name || user.user_metadata.full_name?.split(' ')[0] || '',
      last_name: profile?.last_name || user.user_metadata.full_name?.split(' ').slice(1).join(' ') || '',
      // Add other profile fields as needed
    }

    return { user: userProfile, session: user }
  }

  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    })

    if (error) return { user: null, error }
    return { 
      user: data.user ? {
        id: data.user.id,
        email: data.user.email || '',
        first_name: firstName,
        last_name: lastName,
      } : null, 
      error: null 
    }
  }

  async signIn(email: string, password: string): Promise<{ user: UserProfile | null; error: Error | null }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password })
    if (error) return { user: null, error }
    return { 
      user: data.user ? {
        id: data.user.id,
        email: data.user.email || '',
        first_name: data.user.user_metadata.first_name,
        last_name: data.user.user_metadata.last_name,
      } : null, 
      error: null 
    }
  }

  async signInWithProvider(provider: 'google' | 'github'): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: '/auth/callback',
          scopes: provider === 'github' ? 'repo gist notifications' : undefined
        }
      })

      if (error) throw error

      return { 
        user: null, 
        session: null, 
        error: null 
      }
    } catch (error) {
      console.error("Error in signIn:", error)
      return { user: null, session: null, error: error as Error }
    }
  }

  async signInWithGoogle(): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error("Error in Google sign-in:", error)
      return { error: error as Error }
    }
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut()
    localStorage.clear()
    sessionStorage.clear()
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void): () => void {
    console.log("onAuthStateChange called");
    const { data: { subscription } } = this.supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed in service:", event, session);
        callback(event, session);
      }
    );

    return () => {
      console.log("Unsubscribing from auth state change");
      subscription.unsubscribe();
    };
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<{ data: UserProfile | null, error: Error | null }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('No user logged in')

      const updates = {
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await this.supabase
        .from('profiles')
        .upsert(updates)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error("Error updating user profile:", error)
      return { data: null, error: error as Error }
    }
  }

  async getModelKeys(): Promise<ModelKey[]> {
    const { data, error } = await this.supabase
      .from('user_model_keys')
      .select('*')
      .order('provider', { ascending: true })
      .order('model_name', { ascending: true });

    if (error) throw error;
    return data.map(key => ({
      id: key.id,
      provider: key.provider,
      modelName: key.model_name,
      apiKey: key.api_key,
      isActive: key.is_active
    }));
  }

  async addModelKey(modelKey: Omit<ModelKey, 'id'>): Promise<{ data: ModelKey | null; error: any }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('No user logged in')

      const { data, error } = await this.supabase
        .from('user_model_keys')
        .insert({
          user_id: user.id,
          provider: modelKey.provider,
          model_name: modelKey.modelName,
          api_key: modelKey.apiKey,
          is_active: modelKey.isActive
        })
        .select()
        .single();

      if (error) throw error;

      const newKey: ModelKey = {
        id: data.id,
        provider: data.provider,
        modelName: data.model_name,
        apiKey: data.api_key,
        isActive: data.is_active
      };

      return { data: newKey, error: null };
    } catch (error) {
      console.error('Error adding model key:', error);
      return { data: null, error };
    }
  }

  async updateModelKey(modelKey: ModelKey): Promise<ModelKey> {
    const { data, error } = await this.supabase
      .from('user_model_keys')
      .update({
        provider: modelKey.provider,
        model_name: modelKey.modelName,
        api_key: modelKey.apiKey,
        is_active: modelKey.isActive
      })
      .eq('id', modelKey.id)
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      provider: data.provider,
      modelName: data.model_name,
      apiKey: data.api_key,
      isActive: data.is_active
    };
  }

  async deleteModelKey(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_model_keys')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getUserSettings(): Promise<{ matchCount: number; mode: 'search' | 'chat' }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('No user logged in')

      const { data, error } = await this.supabase
        .from('user_settings')
        .select('match_count, mode')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 is the error code for no rows returned

      return data ? {
        matchCount: data.match_count,
        mode: data.mode as 'search' | 'chat'
      } : {
        matchCount: 5, // default value
        mode: 'chat' // default value
      }
    } catch (error) {
      console.error("Error getting user settings:", error)
      throw error
    }
  }

  async updateUserSettings(settings: { matchCount: number; mode: 'search' | 'chat' }): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('No user logged in')

      const { error } = await this.supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          match_count: settings.matchCount,
          mode: settings.mode
        })

      if (error) throw error
    } catch (error) {
      console.error("Error updating user settings:", error)
      throw error
    }
  }

  initAuthStateChange() {
    return this.supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user)
      if (event === 'SIGNED_OUT') {
        // Handle user logout
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Handle user login or token refresh
        await this.getCurrentUser()
      }
    })
  }

  async getUserProfile(): Promise<UserProfile | null> {
    const { data: { session } } = await this.supabase.auth.getSession()
    if (!session) return null
  
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
  
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  
    return {
      id: session.user.id,
      email: session.user.email || '',
      first_name: profile?.first_name || session.user.user_metadata.first_name,
      last_name: profile?.last_name || session.user.user_metadata.last_name,
      // ... other profile fields ...
    }
  }

  async requireAuth(): Promise<UserProfile | null> {
    const { user, session } = await this.getCurrentUser();
    if (!user || !session) {
      window.location.href = '/auth/login';
      return null;
    }
    return user;
  }
}

// Export a function to create a new instance of UserService
export function createUserService() {
  return new UserService();
}

