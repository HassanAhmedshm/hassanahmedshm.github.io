import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';
import { scheduleDeferredAnimation } from '../../utils/animation';

const WebGLContextHandler = () => {
  const { gl } = useThree();
  const isContextLostRef = useRef(false);

  const handleContextLost = useCallback((e: Event) => {
    e.preventDefault();
    isContextLostRef.current = true;
    throw new Error('WebGL context lost');
  }, []);

  const handleContextRestored = useCallback(() => {
    isContextLostRef.current = false;
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

const colors = [
  new THREE.Color('#3b82f6'),
  new THREE.Color('#FF7A00'),
  new THREE.Color('#8b5cf6'),
  new THREE.Color('#06b6d4'),
  new THREE.Color('#f472b6'),
];

const FloatingParticles = () => {
  const { recommendedParticleCount, hasWebGL, prefersReducedMotion } = useDeviceCapabilities();
  const meshRef = useRef<THREE.Points>(null);
  const scrollY = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  if (!hasWebGL || prefersReducedMotion) return null;

  const count = Math.min(recommendedParticleCount, 300);

  const { positions, velocities, colorArray, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 5 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i3] = Math.sin(phi) * Math.cos(theta) * radius;
      pos[i3 + 1] = Math.sin(phi) * Math.sin(theta) * radius * 0.6;
      pos[i3 + 2] = Math.cos(phi) * radius * 0.4;

      vel[i3] = (Math.random() - 0.5) * 0.003;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.003;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.001;

      const c = colors[Math.floor(Math.random() * colors.length)];
      cols[i3] = c.r;
      cols[i3 + 1] = c.g;
      cols[i3 + 2] = c.b;

      siz[i] = 0.01 + Math.random() * 0.03;
    }

    return { positions: pos, velocities: vel, colorArray: cols, sizes: siz };
  }, [count]);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    };
    const handleMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.1;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 0.1;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const positionAttr = meshRef.current.geometry.attributes.position;
    const posArr = positionAttr.array as Float32Array;
    const time = clock.getElapsedTime();

    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const baseOpacity = theme === 'light' ? 0.15 : 0.3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArr[i3] += velocities[i3] + Math.sin(time * 0.1 + i) * 0.001;
      posArr[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.12 + i * 0.5) * 0.001;
      posArr[i3 + 2] += velocities[i3 + 2];

      const radius = 20;
      if (Math.abs(posArr[i3]) > radius) posArr[i3] *= -0.95;
      if (Math.abs(posArr[i3 + 1]) > radius) posArr[i3 + 1] *= -0.95;
      if (Math.abs(posArr[i3 + 2]) > 10) posArr[i3 + 2] *= -0.95;
    }

    positionAttr.needsUpdate = true;

    const material = meshRef.current.material as THREE.PointsMaterial;
    const scrollInfluence = Math.min(1, scrollY.current * 1.5);

    material.opacity = baseOpacity + scrollInfluence * 0.2;
    material.size = 0.02 + scrollInfluence * 0.015;

    if (meshRef.current.rotation) {
      meshRef.current.rotation.x += 0.0002 + mouse.current.y * 0.0001;
      meshRef.current.rotation.y += 0.0003 + mouse.current.x * 0.0001;
    }
  });

  return (
    <points ref={meshRef} rotation={[0.2, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colorArray}
          itemSize={3}
          args={[colorArray, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const AmbientField = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.05;
    meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.015) * 0.05;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(8, 1);
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial
        color="#3b82f6"
        wireframe
        transparent
        opacity={0.04}
      />
    </mesh>
  );
};

const Scene = () => {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    scheduleDeferredAnimation(() => {
      setShowParticles(true);
    });
  }, []);

  return (
    <Canvas
      id="webgl-canvas"
      aria-label="3D particle background"
      camera={{ position: [0, 0, 12], fov: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}
    >
      <WebGLContextHandler />
      {showParticles && (
        <>
          <FloatingParticles />
          <AmbientField />
        </>
      )}
    </Canvas>
  );
};

export default Scene;
