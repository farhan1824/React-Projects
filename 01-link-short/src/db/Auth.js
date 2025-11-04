// utils/login.js
import supabase, { supabaseUrl } from "./supabase";

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    throw error;
  }

  return data.user;
}

export async function getCurrentUser() {
  const { data: session, error } = await supabase.auth.getSession();
  if (!session.session) return null;
  if (error) {
    console.error("Get current user error:", error.message);
    throw error;
  }
  return session.session?.user;
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export async function signup({ name, email, password, profile_pic }) {
  const filename = `dp-${name.split("").join("-")}-${Date.now()}`;

  // Upload profile picture
  const { error: uploadError } = await supabase.storage
    .from("profile_pic")
    .upload(filename, profile_pic);
  if (uploadError) throw uploadError;

  // Signup user
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        name: name.trim(),
        profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${filename}`,
      },
    },
  });
  if (error) throw error;

  // Sign in to get session
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
  if (signInError) throw signInError;

  return signInData; // contains user + session
}
