// Creates the private "pan-cards" storage bucket used for center PAN card uploads.
// Run once via: npm run db:setup-storage
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data: buckets, error: listError } = await supabase.storage.listBuckets();
if (listError) throw listError;

if (buckets.some((b) => b.name === "pan-cards")) {
  console.log("Bucket 'pan-cards' already exists — nothing to do.");
} else {
  const { error } = await supabase.storage.createBucket("pan-cards", {
    public: false,
    fileSizeLimit: "10MB",
    allowedMimeTypes: ["image/png", "image/jpeg", "application/pdf"],
  });
  if (error) throw error;
  console.log("Created private bucket 'pan-cards'.");
}
