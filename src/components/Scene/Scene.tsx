import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';
import { scheduleDeferredAnimation } from '../../utils/animation';

/**
 * WebGLContextHandler - Handles WebGL context loss and restoration
 * Must be used inside Canvas to access gl via useThree
 */
const WebGLContextHandler = () => {
  const { gl } = useThree();
  const isContextLostRef = useRef(false);

  const handleContextLost = useCallback((e: Event) => {
    e.preventDefault();
    console.error('WebGL context lost');
    isContextLostRef.current = true;
    // Trigger error boundary by throwing error
    throw new Error('WebGL context lost');
  }, []);

  const handleContextRestored = useCallback(() => {
    console.log('WebGL context restored');
    isContextLostRef.current = false;
    // Reinitialize scene - force re-render by disposing and recreating
    gl.dispose();
  }, [gl]);

  useEffect(() => {
    const canvas = gl.domElement;
    
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);
    
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl, handleContextLost, handleContextRestored]);

  return null;
};

/**
 * FloatingParticles - Subtle background particle mesh
 * Adapts particle count based on device capabilities
 */
const FloatingParticles = () => {
  const { recommendedParticleCount, hasWebGL, prefersReducedMotion } = useDeviceCapabilities();
  const meshRef = useRef<THREE.Points<THREE.BufferGeometry>>(null);
  
  // Early return if WebGL not available or user prefers reduced motion
  if (!hasWebGL || prefersReducedMotion) return null;
  
  const count = recommendedParticleCount;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      
      velocities[i3] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    
    return { positions, velocities };
  }, [count]);
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] += particles.velocities[i3];
      positions[i3 + 1] += particles.velocities[i3 + 1];
      positions[i3 + 2] += particles.velocities[i3 + 2];
      
      // Wrap around bounds
      if (Math.abs(positions[i3]) > 10) positions[i3] *= -0.9;
      if (Math.abs(positions[i3 + 1]) > 10) positions[i3 + 1] *= -0.9;
      if (Math.abs(positions[i3 + 2]) > 5) positions[i3 + 2] *= -0.9;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#3b82f6"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

/**
 * Scene - Three.js canvas for WebGL background
 * Includes WebGL context loss handling for graceful error recovery
 * Defers non-critical animations using requestIdleCallback
 * 
 * Validates: Requirements 11.1, 11.4
 */
const Scene = () => {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    // Defer floating particles initialization using requestIdleCallback
    // Validating: Requirements 11.1, 11.4
    scheduleDeferredAnimation(() => {
      setShowParticles(true);
    });
  }, []);

  return (
    <Canvas
      id="webgl-canvas"
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
    >
      <WebGLContextHandler />
      <color attach="background" args={['#0a0a0a']} />
      {showParticles && <FloatingParticles />}
    </Canvas>
  );
};

export default Scene;