import supabase from "./supabase";
import { UAParser } from "ua-parser-js";
export async function getClicks(url_id) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", url_id);

  if (error) {
    console.error("Get current user error:", error.message);
    throw error;
  }
  return data;
}
const parser = new UAParser();
export const storeclicks = async ({ id, original_url }) => {
  try {
    const device = parser.getResult().type || "desktop";

    // Optional: skip IP location for now
    await supabase.from("clicks").insert({
      url_id: id,
      device,
    });

    // Redirect after storing click
    window.location.href = original_url;
  } catch (error) {
    console.log("Error storing click:", error);
    window.location.href = original_url;
  }
};
export async function getTheClicksOfSpecificClick(url_id) {
  if (!url_id) return [];
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error("Unable To Load Stats:", error.message);
    throw error;
  }
  return data;
}
