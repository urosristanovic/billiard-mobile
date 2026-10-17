import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { File, UploadType } from 'expo-file-system';
import { API_ENDPOINTS } from '@/config/api';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import { getAccessToken } from '@/features/auth/getAccessToken';
import type { ApiResponse } from '@/types/api';

const MAX_DIMENSION = 512;
const JPEG_QUALITY = 0.7;
const MAX_FILE_SIZE_BYTES = 256 * 1024; // 256 KB

interface AvatarUploadUrlResponse {
  signedUrl: string;
  token: string;
  path: string;
  publicUrl: string;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const result: ApiResponse<T> = await res.json();
  if (!res.ok) {
    throw new Error(result.success ? `HTTP ${res.status}` : result.error);
  }
  if (!result.success) throw new Error(result.error);
  return result.data;
}

/**
 * Opens the native photo library, lets the user pick and crop a square image,
 * resizes + compresses it, enforces the size cap, uploads it directly to
 * Supabase Storage via a signed URL, and returns the resulting public URL.
 *
 * Returns null if the user dismisses the picker without selecting an image.
 * Throws a user-friendly Error on any other failure.
 */
export async function pickAndUploadAvatar(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Photo library permission is required to change your avatar.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: JPEG_QUALITY,
  });

  if (result.canceled) return null;

  const asset = result.assets[0];

  // Resize to at most MAX_DIMENSION × MAX_DIMENSION and re-encode as JPEG.
  const manipulated = await ImageManipulator.manipulateAsync(
    asset.uri,
    [{ resize: { width: MAX_DIMENSION, height: MAX_DIMENSION } }],
    { compress: JPEG_QUALITY, format: ImageManipulator.SaveFormat.JPEG },
  );

  // Check compressed file size.
  // NOTE: React Native's Blob polyfill does not support creating Blobs from
  // ArrayBuffer/ArrayBufferView (fetch().blob() throws). expo-file-system's File
  // class exposes a synchronous .size property that reads the native file size
  // without going through the Blob polyfill.
  const localFile = new File(manipulated.uri);
  if (localFile.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `Image is too large after compression (${Math.round(localFile.size / 1024)} KB). Please choose a smaller photo.`,
    );
  }

  // Request a signed upload URL from the API.
  const token = await getAccessToken();
  const urlRes = await fetchWithTimeout(API_ENDPOINTS.uploads.avatarUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contentType: 'image/jpeg' }),
  });
  const { signedUrl, publicUrl } =
    await parseResponse<AvatarUploadUrlResponse>(urlRes);

  // PUT the file directly to Supabase Storage — no API server in the path.
  // File.upload with BINARY_CONTENT sends raw file bytes, which is what a
  // Supabase Storage signed PUT URL expects (no multipart framing).
  const uploadResult = await localFile.upload(signedUrl, {
    httpMethod: 'PUT',
    uploadType: UploadType.BINARY_CONTENT,
    headers: { 'Content-Type': 'image/jpeg' },
  });

  if (uploadResult.status < 200 || uploadResult.status >= 300) {
    throw new Error(`Upload failed (${uploadResult.status}). Please try again.`);
  }

  return publicUrl;
}
