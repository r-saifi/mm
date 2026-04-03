/**
 * Supabase Storage utilities — upload & delete images.
 * Bucket: "images" (must be created as Public in Supabase dashboard)
 *
 * Folder structure:
 *   images/projects/...  ← portfolio project photos
 *   images/hero/...      ← hero carousel photos
 */
import { supabase, supabaseReady } from './supabase';

const BUCKET = 'images';

function uniquePath(folder, file) {
  const ext = file.name.split('.').pop();
  return `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
}

/**
 * Upload a single File. Returns the public URL string.
 */
export async function uploadFile(file, folder = 'projects') {
  if (!supabaseReady || !supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file, then restart the dev server.'
    );
  }

  const path = uniquePath(folder, file);

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload multiple Files sequentially, calling onProgress(index, 0-100) per file.
 * Returns array of public URLs in order.
 */
export async function uploadFiles(fileObjs, folder = 'projects', onProgress) {
  const urls = [];
  for (let i = 0; i < fileObjs.length; i++) {
    onProgress?.(fileObjs[i].id, 30);          // "starting" indicator
    const url = await uploadFile(fileObjs[i].file, folder);
    onProgress?.(fileObjs[i].id, 100);
    urls.push(url);
  }
  return urls;
}

/**
 * Delete a file given its full public Supabase URL.
 * No-ops silently if the URL isn't from Supabase storage.
 */
export async function deleteFile(publicUrl) {
  if (!supabaseReady || !supabase || !publicUrl) return;
  try {
    const marker = `/object/public/${BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return;
    const filePath = decodeURIComponent(publicUrl.slice(idx + marker.length));
    const { error } = await supabase.storage.from(BUCKET).remove([filePath]);
    if (error) console.warn('Storage delete:', error.message);
  } catch (e) {
    console.warn('deleteFile error:', e);
  }
}
