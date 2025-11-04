import supabase, { supabaseUrl } from "./supabase";
export async function getUrls(user_id) {
  if (!user_id) return [];
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error("Get current user error:", error.message);
    throw error;
  }
  return data;
}

export async function deleteUrl(id) {
  const { data, error } = await supabase.from("urls").delete("").eq("id", id);
  if (error) {
    console.error("Get current user error:", error.message);
    throw error;
  }
  return data;
}

export async function createUrl(
  { title, original_url, custom_url, user_id },
  qrBlob
) {
  const short_url = Math.random().toString(36).substring(2, 6);
  const filename = `qr-${short_url}.png`;

  // Ensure the blob has correct MIME type
  const pngBlob =
    qrBlob instanceof Blob ? new Blob([qrBlob], { type: "image/png" }) : qrBlob;

  // Upload QR code to Supabase storage
  const { error: uploadError } = await supabase.storage
    .from("Qrs")
    .upload(filename, pngBlob, { contentType: "image/png" });

  if (uploadError) throw uploadError;

  // Construct public URL
  const qrCode = `${supabaseUrl}/storage/v1/object/public/Qrs/${filename}`;

  // Insert URL record into DB
  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        title,
        original_url,
        custom_url: custom_url || null,
        user_id,
        qr_code: qrCode,
        short_url,
      },
    ])
    .select();

  if (error) {
    console.error("Error creating URL:", error.message);
    throw error;
  }

  return data;
}
export async function getLongUrl(id) {
  if (!id) throw new Error("Missing URL identifier.");

  const { data, error } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (error) {
    console.error("Get long URL error:", error.message);
    throw error;
  }
  return data;
}

export async function getTheUrlsOfSpecificUser({ id, user_id } = {}) {
  if (!user_id) return [];
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error("Short Url Not Found:", error.message);
    throw error;
  }
  return data;
}

// export const storeclicks = async ({ id, original_url }) => {
//   try {
//     const res = parser.getResult();
//     const device = res.type || "desktop";

//     const response = await fetch("https://ipapi.co/json");
//     const { city, country_name: country } = await response.json();

//     await supabase.from("clicks").insert({
//       url_id: id,
//       city,
//       country,
//       device,
//     });

//     window.location.href = original_url;
//   } catch (error) {
//     console.log("Error storing click:", error);
//     window.location.href = original_url;
//   }
// };
