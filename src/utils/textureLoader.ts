import * as THREE from 'three';

/**
 * Result of a texture loading attempt with fallback chain
 */
export interface TextureLoadResult {
  /** Loaded texture or null if all attempts failed */
  texture: THREE.Texture | null;

  /** Error from last failed attempt */
  error: Error | null;

  /** Source that successfully loaded the texture */
  source: 'local' | 'cdn' | 'fallback';
}

/**
 * Loads a texture with fallback chain: local asset → CDN → fallback (null)
 *
 * @param localPath - Path to local asset (e.g., '/textures/earth-blue-marble.jpg')
 * @param cdnUrl - CDN URL for fallback (e.g., 'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg')
 * @param loader - THREE.TextureLoader instance
 * @returns Promise resolving to TextureLoadResult
 */
export async function loadTextureWithFallback(
  localPath: string,
  cdnUrl: string,
  loader: THREE.TextureLoader
): Promise<TextureLoadResult> {
  // Attempt 1: Local asset
  try {
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      loader.load(localPath, resolve, undefined, reject);
    });
    return { texture, error: null, source: 'local' };
  } catch (localError) {
    console.warn('Local texture load failed, trying CDN:', localPath, localError);
  }

  // Attempt 2: CDN fallback
  try {
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      loader.load(cdnUrl, resolve, undefined, reject);
    });
    return { texture, error: null, source: 'cdn' };
  } catch (cdnError) {
    console.error('CDN texture load failed:', cdnUrl, cdnError);
    return {
      texture: null,
      error: cdnError instanceof Error ? cdnError : new Error(String(cdnError)),
      source: 'fallback'
    };
  }
}