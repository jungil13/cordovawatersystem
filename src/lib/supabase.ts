import { createClient } from "@supabase/supabase-js";

// Read from Vite environment variables (.env) or window/fallback
const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  envUrl && envKey && envUrl.startsWith("http") && !envUrl.includes("your-project-id")
);

export const supabase = isSupabaseConfigured
  ? createClient(envUrl, envKey)
  : null;

/**
 * Uploads an image file to Supabase Storage (bucket 'cwsi-media').
 * If bucket is unavailable or offline, converts to an optimized Data URL string.
 */
export async function uploadImageFile(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("cwsi-media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (!uploadError) {
        const { data } = supabase.storage.from("cwsi-media").getPublicUrl(filePath);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }
    } catch (e) {
      console.warn("Supabase storage upload fallback to data URL:", e);
    }
  }

  // Fallback: Convert file directly to Base64 Data URL for instant rendering & DB storage
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
