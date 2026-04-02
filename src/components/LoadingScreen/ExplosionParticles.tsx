/* ============================================
   ExplosionParticles.tsx — Cinematic Tesseract Explosion
   ============================================
   A visually stunning explosion with:
   - Dense particle cloud (1200+ particles)
   - Dramatic implosion with anticipation
   - Explosive burst with multiple layers
   - Glowing core, shockwave rings, and sparks
   - Smooth easing and camera effects
   ============================================ */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 1200;
const SPARK_COUNT = 200;
const IMPLOSION_DURATION = 0.35;
const FREEZE_DURATION = 0.08;
const EXPLOSION_DURATION = 0.85;
const TOTAL_DURATION = IMPLOSION_DURATION + FREEZE_DURATION + EXPLOSION_DURATION;

// Easing functions for smoother animations
const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
const easeInQuart = (t: number) => t * t * t * t;
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Generate main particle system with varied behaviors
 */
function generateParticles(sourcePositions: Float32Array | null) {
  const startPositions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const delays = new Float32Array(PARTICLE_COUNT);
  const rotationSpeeds = new Float32Array(PARTICLE_COUNT);
  const sourceCount = sourcePositions ? sourcePositions.length / 3 : 0;

  // Color palette (blue to cyan to white)
  const colorPalette = [
    new THREE.Color(0x3b82f6), // Primary blue
    new THREE.Color(0x60a5fa), // Light blue
    new THREE.Color(0x22d3ee), // Cyan
    new THREE.Color(0x67e8f9), // Light cyan
    new THREE.Color(0xffffff), // White (core)
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;

    // Start from tesseract vertices with some scatter
    if (sourceCount > 0 && sourcePositions) {
      const src = Math.floor(Math.random() * sourceCount) * 3;
      const scatter = 0.1 + Math.random() * 0.1;
      startPositions[i3] = sourcePositions[src] + (Math.random() - 0.5) * scatter;
      startPositions[i3 + 1] = sourcePositions[src + 1] + (Math.random() - 0.5) * scatter;
      startPositions[i3 + 2] = sourcePositions[src + 2] + (Math.random() - 0.5) * scatter;
    } else {
      // Fallback: spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.5 + Math.random() * 0.5;
      startPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
      startPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      startPositions[i3 + 2] = r * Math.cos(phi);
    }

    // Calculate direction from center
    const px = startPositions[i3];
    const py = startPositions[i3 + 1];
    const pz = startPositions[i3 + 2];
    const len = Math.sqrt(px * px + py * py + pz * pz) || 1;

    // Create distinct particle layers with different behaviors
    const layer = Math.random();
    let speed: number, size: number, colorIdx: number;
    
    if (layer < 0.15) {
      // Ultra-fast streaking particles (leading edge)
      speed = 18 + Math.random() * 8;
      size = 0.015 + Math.random() * 0.015;
      colorIdx = 4; // White
      delays[i] = 0;
    } else if (layer < 0.35) {
      // Fast energy particles
      speed = 10 + Math.random() * 6;
      size = 0.025 + Math.random() * 0.02;
      colorIdx = Math.random() < 0.5 ? 2 : 3; // Cyan
      delays[i] = Math.random() * 0.02;
    } else if (layer < 0.65) {
      // Medium debris particles
      speed = 5 + Math.random() * 4;
      size = 0.04 + Math.random() * 0.03;
      colorIdx = Math.random() < 0.5 ? 0 : 1; // Blue
      delays[i] = Math.random() * 0.05;
    } else if (layer < 0.85) {
      // Slow glowing embers
      speed = 2 + Math.random() * 2;
      size = 0.06 + Math.random() * 0.04;
      colorIdx = 0; // Primary blue
      delays[i] = Math.random() * 0.08;
    } else {
      // Core glow particles (stay near center longer)
      speed = 0.5 + Math.random() * 1.5;
      size = 0.08 + Math.random() * 0.06;
      colorIdx = 4; // White core
      delays[i] = Math.random() * 0.1;
    }

    sizes[i] = size;
    rotationSpeeds[i] = (Math.random() - 0.5) * 4;

    // Set color
    const color = colorPalette[colorIdx];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    // Explosion velocity with spiral component
    const spiralAngle = Math.random() * Math.PI * 2;
    const spiralStrength = 0.15;
    const spread = 0.3 + Math.random() * 0.2;
    
    velocities[i3] = (px / len + (Math.random() - 0.5) * spread + Math.cos(spiralAngle) * spiralStrength) * speed;
    velocities[i3 + 1] = (py / len + (Math.random() - 0.5) * spread + Math.sin(spiralAngle) * spiralStrength) * speed;
    velocities[i3 + 2] = (pz / len + (Math.random() - 0.5) * spread) * speed;
  }

  return { startPositions, velocities, sizes, colors, delays, rotationSpeeds };
}

/**
 * Generate spark particles (thin, fast streaks)
 */
function generateSparks() {
  const positions = new Float32Array(SPARK_COUNT * 3);
  const velocities = new Float32Array(SPARK_COUNT * 3);
  const sizes = new Float32Array(SPARK_COUNT);

  for (let i = 0; i < SPARK_COUNT; i++) {
    const i3 = i * 3;
    
    // Start near center
    const r = Math.random() * 0.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);

    // Very fast outward velocity
    const speed = 20 + Math.random() * 15;
    const dir = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]).normalize();
    velocities[i3] = dir.x * speed;
    velocities[i3 + 1] = dir.y * speed;
    velocities[i3 + 2] = dir.z * speed;

    sizes[i] = 0.01 + Math.random() * 0.01;
  }

  return { positions, velocities, sizes };
}

interface ExplosionParticlesProps {
  sourcePositions: Float32Array | null;
  onComplete?: () => void;
}

export default function ExplosionParticles({ sourcePositions, onComplete }: ExplosionParticlesProps) {
  const particleMaterialRef = useRef<THREE.PointsMaterial>(null);
  const sparkMaterialRef = useRef<THREE.PointsMaterial>(null);
  const coreMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const shockwave2Ref = useRef<THREE.Mesh>(null);
  const shockwave3Ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const elapsedRef = useRef(0);
  const completedRef = useRef(false);
  const cameraBasePos = useRef(new THREE.Vector3(0, 0, 5));

  const { startPositions, velocities, sizes, colors, delays } = useMemo(
    () => generateParticles(sourcePositions),
    [sourcePositions]
  );

  const sparkData = useMemo(() => generateSparks(), []);

  // Main particle geometry
  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(startPositions), 3));
    geo.setAttribute('size', new THREE.BufferAttribute(new Float32Array(sizes), 1));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    return geo;
  }, [startPositions, sizes, colors]);

  // Spark geometry
  const sparkGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(sparkData.positions), 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sparkData.sizes, 1));
    return geo;
  }, [sparkData]);

  // Shockwave ring geometry (thin ring)
  const shockwaveGeometry = useMemo(() => new THREE.RingGeometry(0.95, 1.0, 64), []);

  useFrame((state, delta) => {
    elapsedRef.current += delta;
    const t = elapsedRef.current;
    const totalProgress = Math.min(t / TOTAL_DURATION, 1);

    const posArr = particleGeometry.attributes.position.array as Float32Array;
    const sizeArr = particleGeometry.attributes.size.array as Float32Array;
    const sparkPosArr = sparkGeometry.attributes.position.array as Float32Array;

    // Phase 1: IMPLOSION (0 - 0.35s) - Dramatic inward pull
    if (t < IMPLOSION_DURATION) {
      const implosionProgress = t / IMPLOSION_DURATION;
      const easeIn = easeInQuart(implosionProgress);
      
      // Accelerating collapse toward center
      const collapseAmount = easeIn * 0.92;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const delay = delays[i];
        const adjustedProgress = Math.max(0, (implosionProgress - delay) / (1 - delay));
        const particleEase = easeInQuart(adjustedProgress);
        
        // Spiral inward effect
        const angle = adjustedProgress * Math.PI * 2;
        const spiralOffset = (1 - particleEase) * 0.1;
        
        posArr[i3] = startPositions[i3] * (1 - particleEase * collapseAmount) + Math.cos(angle) * spiralOffset;
        posArr[i3 + 1] = startPositions[i3 + 1] * (1 - particleEase * collapseAmount) + Math.sin(angle) * spiralOffset;
        posArr[i3 + 2] = startPositions[i3 + 2] * (1 - particleEase * collapseAmount);
        
        // Particles grow and brighten as they collapse
        sizeArr[i] = sizes[i] * (1 + particleEase * 1.5);
      }

      // Progressive camera shake (builds tension)
      const shakeIntensity = easeInQuart(implosionProgress) * 0.06;
      const shakeFreq = 15 + implosionProgress * 20;
      state.camera.position.x = cameraBasePos.current.x + Math.sin(t * shakeFreq) * shakeIntensity;
      state.camera.position.y = cameraBasePos.current.y + Math.cos(t * shakeFreq * 1.3) * shakeIntensity;

      // Core glow builds up
      if (glowRef.current) {
        const scale = 0.3 + easeIn * 0.5;
        glowRef.current.scale.set(scale, scale, scale);
        if (coreMaterialRef.current) {
          coreMaterialRef.current.opacity = easeIn * 0.9;
        }
      }

      // Shockwaves contract inward
      if (shockwaveRef.current) {
        const scale = 4 - implosionProgress * 3.5;
        shockwaveRef.current.scale.set(scale, scale, scale);
        (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = implosionProgress * 0.6;
      }
    }
    // Phase 2: FREEZE/SINGULARITY (0.35 - 0.43s) - Maximum compression
    else if (t < IMPLOSION_DURATION + FREEZE_DURATION) {
      const freezeProgress = (t - IMPLOSION_DURATION) / FREEZE_DURATION;
      
      // Intense pulsing at singularity
      const pulse = 1 + Math.sin(freezeProgress * Math.PI * 6) * 0.3;
      const breathe = 1 + Math.sin(freezeProgress * Math.PI * 2) * 0.1;
      
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const compressionPoint = 0.08;
        posArr[i3] = startPositions[i3] * compressionPoint * pulse;
        posArr[i3 + 1] = startPositions[i3 + 1] * compressionPoint * pulse;
        posArr[i3 + 2] = startPositions[i3 + 2] * compressionPoint * pulse;
        
        sizeArr[i] = sizes[i] * 2.5 * breathe;
      }

      // Intense camera shake at peak
      const intensity = 0.1 * (1 + Math.sin(freezeProgress * Math.PI));
      state.camera.position.x = cameraBasePos.current.x + (Math.random() - 0.5) * intensity;
      state.camera.position.y = cameraBasePos.current.y + (Math.random() - 0.5) * intensity;

      // Core at maximum brightness
      if (glowRef.current) {
        glowRef.current.scale.set(0.8 * pulse, 0.8 * pulse, 0.8 * pulse);
        if (coreMaterialRef.current) {
          coreMaterialRef.current.opacity = 1.0;
        }
      }

      // Shockwaves at minimum
      if (shockwaveRef.current) {
        shockwaveRef.current.scale.set(0.5, 0.5, 0.5);
        (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = 1.0;
      }
    }
    // Phase 3: EXPLOSION (0.43 - 1.28s) - Massive outward burst
    else {
      const explosionTime = t - IMPLOSION_DURATION - FREEZE_DURATION;
      const explosionProgress = Math.min(explosionTime / EXPLOSION_DURATION, 1);
      const easeOut = easeOutExpo(explosionProgress);
      const easeOutSoft = easeOutQuart(explosionProgress);

      // Camera settles with slight recoil
      const recoil = Math.max(0, 1 - explosionProgress * 3) * 0.05;
      state.camera.position.x = cameraBasePos.current.x + (Math.random() - 0.5) * recoil;
      state.camera.position.y = cameraBasePos.current.y + (Math.random() - 0.5) * recoil;

      // Main particles explode outward with staggered timing
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const delay = delays[i] * 0.5; // Reduced delay for more unified burst
        const adjustedProgress = Math.max(0, (explosionProgress - delay) / (1 - delay));
        const particleEase = easeOutExpo(adjustedProgress);
        
        // Start from compressed position, explode outward
        const startScale = 0.08;
        const distance = particleEase * 1.2;
        
        posArr[i3] = startPositions[i3] * startScale + velocities[i3] * distance;
        posArr[i3 + 1] = startPositions[i3 + 1] * startScale + velocities[i3 + 1] * distance;
        posArr[i3 + 2] = startPositions[i3 + 2] * startScale + velocities[i3 + 2] * distance;
        
        // Size peaks early then shrinks
        const sizeCurve = Math.sin(adjustedProgress * Math.PI * 0.7) + 0.3;
        sizeArr[i] = sizes[i] * sizeCurve * (2.5 - explosionProgress * 1.5);
      }

      // Sparks fly outward (faster than main particles)
      for (let i = 0; i < SPARK_COUNT; i++) {
        const i3 = i * 3;
        const sparkEase = easeOutExpo(Math.min(explosionProgress * 1.5, 1));
        sparkPosArr[i3] = sparkData.velocities[i3] * sparkEase * 0.8;
        sparkPosArr[i3 + 1] = sparkData.velocities[i3 + 1] * sparkEase * 0.8;
        sparkPosArr[i3 + 2] = sparkData.velocities[i3 + 2] * sparkEase * 0.8;
      }
      sparkGeometry.attributes.position.needsUpdate = true;

      // Core shrinks and fades
      if (glowRef.current) {
        const coreScale = Math.max(0, 0.8 - easeOut * 0.8);
        glowRef.current.scale.set(coreScale, coreScale, coreScale);
        if (coreMaterialRef.current) {
          coreMaterialRef.current.opacity = Math.max(0, 1 - easeOut * 1.5);
        }
      }

      // Multiple shockwave rings expand at different speeds
      if (shockwaveRef.current) {
        const scale = 0.5 + easeOut * 25;
        shockwaveRef.current.scale.set(scale, scale, scale);
        (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - easeOutSoft * 1.0);
      }
      if (shockwave2Ref.current) {
        const scale2 = 0.3 + easeOut * 20;
        shockwave2Ref.current.scale.set(scale2, scale2, scale2);
        (shockwave2Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.6 - easeOutSoft * 0.8);
      }
      if (shockwave3Ref.current) {
        const scale3 = 0.2 + easeOut * 15;
        shockwave3Ref.current.scale.set(scale3, scale3, scale3);
        (shockwave3Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.4 - easeOutSoft * 0.6);
      }
    }

    particleGeometry.attributes.position.needsUpdate = true;
    particleGeometry.attributes.size.needsUpdate = true;

    // Main particle material opacity
    if (particleMaterialRef.current) {
      let opacity: number;
      if (t < IMPLOSION_DURATION) {
        // Build up during implosion
        opacity = 0.7 + easeInQuart(t / IMPLOSION_DURATION) * 0.5;
      } else if (t < IMPLOSION_DURATION + FREEZE_DURATION) {
        // Maximum brightness at singularity
        opacity = 1.4;
      } else {
        // Gradual fade during explosion
        const explosionProgress = (t - IMPLOSION_DURATION - FREEZE_DURATION) / EXPLOSION_DURATION;
        opacity = 1.4 - easeOutQuart(explosionProgress) * 1.4;
      }
      particleMaterialRef.current.opacity = Math.max(0, opacity);
    }

    // Spark material opacity
    if (sparkMaterialRef.current) {
      if (t < IMPLOSION_DURATION + FREEZE_DURATION) {
        sparkMaterialRef.current.opacity = 0;
      } else {
        const explosionProgress = (t - IMPLOSION_DURATION - FREEZE_DURATION) / EXPLOSION_DURATION;
        // Sparks appear bright then fade quickly
        const sparkOpacity = Math.sin(Math.min(explosionProgress * 2, 1) * Math.PI) * 1.2;
        sparkMaterialRef.current.opacity = Math.max(0, sparkOpacity);
      }
    }

    // Completion
    if (totalProgress >= 1 && !completedRef.current) {
      completedRef.current = true;
      // Reset camera position
      state.camera.position.copy(cameraBasePos.current);
      onComplete?.();
    }
  });

  return (
    <group>
      {/* Central glow core */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          ref={coreMaterialRef}
          color="#ffffff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Main particle system with vertex colors */}
      <points geometry={particleGeometry}>
        <pointsMaterial
          ref={particleMaterialRef}
          vertexColors
          size={0.06}
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Fast-moving sparks */}
      <points geometry={sparkGeometry}>
        <pointsMaterial
          ref={sparkMaterialRef}
          color="#ffffff"
          size={0.02}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Primary shockwave ring */}
      <mesh ref={shockwaveRef} rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={shockwaveGeometry} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Secondary shockwave (slightly delayed) */}
      <mesh ref={shockwave2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.0, 64]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Tertiary shockwave (creates depth) */}
      <mesh ref={shockwave3Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 1.0, 64]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
