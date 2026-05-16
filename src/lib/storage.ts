import { supabase } from "@/integrations/supabase/client";

const MEDIA_BUCKET = "media";

/**
 * Uploads a file to the public `media` bucket and returns its public URL.
 * Used for post featured images, inline article images, and PDFs.
 */
export async function uploadMedia(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
