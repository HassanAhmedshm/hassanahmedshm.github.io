import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as THREE from 'three';
import { loadTextureWithFallback, TextureLoadResult } from './textureLoader';

/**
 * Unit tests for texture loader with fallback chain
 * Validates: Requirements 2.1, 2.2, 2.3
 */

describe('loadTextureWithFallback', () => {
  let loader: THREE.TextureLoader;
  let mockLoad: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockLoad = vi.fn();
    loader = {
      load: mockLoad,
    } as unknown as THREE.TextureLoader;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads local texture first', async () => {
    const mockTexture = { isTexture: true } as THREE.Texture;
    mockLoad.mockImplementation((_url: string, onLoad: (texture: THREE.Texture) => void) => {
      onLoad(mockTexture);
    });

    const result = await loadTextureWithFallback(
      '/textures/earth.jpg',
      'https://cdn.example.com/earth.jpg',
      loader
    );

    expect(result.source).toBe('local');
    expect(result.texture).toBe(mockTexture);
    expect(result.error).toBeNull();
    expect(mockLoad).toHaveBeenCalledTimes(1);
    expect(mockLoad).toHaveBeenCalledWith('/textures/earth.jpg', expect.any(Function), undefined, expect.any(Function));
  });

  it('falls back to CDN when local fails', async () => {
    const mockTexture = { isTexture: true } as THREE.Texture;
    const localError = new Error('Local load failed');
    
    mockLoad
      .mockImplementationOnce((_url: string, _onLoad: () => void, _onProgress: unknown, onError: (err: Error) => void) => {
        onError(localError);
      })
      .mockImplementationOnce((_url: string, onLoad: (texture: THREE.Texture) => void) => {
        onLoad(mockTexture);
      });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await loadTextureWithFallback(
      '/textures/earth.jpg',
      'https://cdn.example.com/earth.jpg',
      loader
    );

    expect(result.source).toBe('cdn');
    expect(result.texture).toBe(mockTexture);
    expect(result.error).toBeNull();
    expect(mockLoad).toHaveBeenCalledTimes(2);
    expect(mockLoad).toHaveBeenNthCalledWith(1, '/textures/earth.jpg', expect.any(Function), undefined, expect.any(Function));
    expect(mockLoad).toHaveBeenNthCalledWith(2, 'https://cdn.example.com/earth.jpg', expect.any(Function), undefined, expect.any(Function));

    consoleWarnSpy.mockRestore();
  });

  it('returns null texture when all sources fail', async () => {
    const localError = new Error('Local load failed');
    const cdnError = new Error('CDN load failed');
    
    mockLoad
      .mockImplementationOnce((_url: string, _onLoad: () => void, _onProgress: unknown, onError: (err: Error) => void) => {
        onError(localError);
      })
      .mockImplementationOnce((_url: string, _onLoad: () => void, _onProgress: unknown, onError: (err: Error) => void) => {
        onError(cdnError);
      });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await loadTextureWithFallback(
      '/textures/earth.jpg',
      'https://cdn.example.com/earth.jpg',
      loader
    );

    expect(result.source).toBe('fallback');
    expect(result.texture).toBeNull();
    expect(result.error).toBe(cdnError);
    expect(mockLoad).toHaveBeenCalledTimes(2);

    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('handles non-Error objects thrown during load', async () => {
    const nonErrorObject = { message: 'Something went wrong' };
    
    mockLoad
      .mockImplementationOnce((_url: string, _onLoad: () => void, _onProgress: unknown, onError: (err: unknown) => void) => {
        onError(nonErrorObject);
      })
      .mockImplementationOnce((_url: string, _onLoad: () => void, _onProgress: unknown, onError: (err: unknown) => void) => {
        onError(nonErrorObject);
      });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await loadTextureWithFallback(
      '/textures/earth.jpg',
      'https://cdn.example.com/earth.jpg',
      loader
    );

    expect(result.source).toBe('fallback');
    expect(result.texture).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe('[object Object]');

    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('does not attempt CDN if local succeeds', async () => {
    const mockTexture = { isTexture: true } as THREE.Texture;
    mockLoad.mockImplementation((_url: string, onLoad: (texture: THREE.Texture) => void) => {
      onLoad(mockTexture);
    });

    await loadTextureWithFallback(
      '/textures/earth.jpg',
      'https://cdn.example.com/earth.jpg',
      loader
    );

    expect(mockLoad).toHaveBeenCalledTimes(1);
    expect(mockLoad).not.toHaveBeenCalledWith('https://cdn.example.com/earth.jpg', expect.any(Function), expect.any(Function), expect.any(Function));
  });
});