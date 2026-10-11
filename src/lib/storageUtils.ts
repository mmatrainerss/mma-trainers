import { supabase, SUPABASE_URL } from './supabase';

export interface UploadProofResult {
  success: boolean;
  publicUrl: string;
  fileName: string;
  error?: string;
}

/**
 * Uploads a student payment screenshot directly to the Supabase Storage 'proofs' bucket.
 * Returns the public HTTPS URL for storage in the client_submissions database table.
 */
export async function uploadPaymentProof(
  file: File,
  prefix: string = 'proof'
): Promise<UploadProofResult> {
  if (!file) {
    return {
      success: false,
      publicUrl: '',
      fileName: '',
      error: 'No file provided for upload.',
    };
  }

  // 1. Sanitize file extension and name
  const rawExt = file.name.split('.').pop() || 'png';
  const cleanExt = rawExt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'png';
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30);

  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const filePath = `${prefix}_${timestamp}_${randomSuffix}_${cleanBaseName}.${cleanExt}`;

  try {
    // 2. Upload file to 'proofs' bucket in Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('proofs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'image/png',
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      return {
        success: false,
        publicUrl: '',
        fileName: file.name,
        error: uploadError.message,
      };
    }

    // 3. Retrieve public URL
    const { data: urlData } = supabase.storage
      .from('proofs')
      .getPublicUrl(uploadData.path);

    const publicUrl =
      urlData?.publicUrl ||
      `${SUPABASE_URL}/storage/v1/object/public/proofs/${uploadData.path}`;

    return {
      success: true,
      publicUrl,
      fileName: file.name,
    };
  } catch (err: any) {
    console.error('Exception during Supabase storage upload:', err);
    return {
      success: false,
      publicUrl: '',
      fileName: file.name,
      error: err?.message || 'Storage upload failed.',
    };
  }
}

/**
 * Checks if Supabase Storage is configured and online
 */
export async function checkStorageHealth(): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from('proofs').list('', { limit: 1 });
    return !error;
  } catch {
    return false;
  }
}
