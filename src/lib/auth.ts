import { supabase } from './supabase';

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Google sign in error:', err);
    throw err;
  }
}

export async function updateUserWithGoogleData(googleData: any) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('ユーザーが見つかりません');

    const { error } = await supabase
      .from('users')
      .update({
        name: googleData.name || null,
        email: googleData.email || null,
        profile_image_url: googleData.picture || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) throw error;
  } catch (err) {
    console.error('Update user data error:', err);
    throw err;
  }
}