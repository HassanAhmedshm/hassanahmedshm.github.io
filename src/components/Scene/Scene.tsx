import { Canvas } from '@react-three/fiber';

/**
 * Scene - Three.js canvas for WebGL background
 */
const Scene = () => {
  return (
    <Canvas
      id="webgl-canvas"
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </Canvas>
  );
};

export default Scene;