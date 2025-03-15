import { supabase } from './supabase';

export async function connectTwitter() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        scopes: 'users.read tweet.read'
      }
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Twitter connect error:', err);
    throw err;
  }
}

export async function updateUserWithTwitterData(twitterData: any) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('ユーザーが見つかりません');

    const { error } = await supabase
      .from('users')
      .update({
        twitter_username: twitterData.user_name,
        bio: twitterData.description || null,
        name: twitterData.name || null,
        profile_image_url: twitterData.avatar_url || null
      })
      .eq('id', user.id);

    if (error) throw error;
  } catch (err) {
    console.error('Update user data error:', err);
    throw err;
  }
}