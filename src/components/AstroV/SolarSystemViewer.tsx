import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause } from 'lucide-react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface SolarSystemViewerProps {
  asteroidDiameter: number;
  velocity: number;
  angle: number;
  isAnimating?: boolean;
  phase?: 'idle' | 'approaching' | 'impact' | 'analyzing' | 'finished';
}

export default function SolarSystemViewer({
  asteroidDiameter,
  velocity,
  angle,
  isAnimating = true,
  phase = 'idle',
}: SolarSystemViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    earth: THREE.Mesh;
    clouds: THREE.Mesh;
    controls: OrbitControls;
    asteroid: THREE.Mesh;
    trajectoryPoints: THREE.Vector3[];
    animationId: number | null;
    time: number;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 150, 300);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.position.set(100, 50, 100);
    scene.add(sunLight);

    const earthGeometry = new THREE.SphereGeometry(20, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg'),
      bumpMap: textureLoader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png'),
      bumpScale: 1.5,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    const cloudGeometry = new THREE.SphereGeometry(20.2, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-clouds.png'),
      transparent: true,
      opacity: 0.4,
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const asteroidSize = Math.log(asteroidDiameter + 1) * 0.5 + 1;
    const asteroidGeometry = new THREE.SphereGeometry(asteroidSize, 16, 16);
    const asteroidMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8b7355,
      emissive: 0x000000,
    });
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    asteroid.visible = true; // Ensure visible by default
    scene.add(asteroid);

    // Create a realistic straight-line trajectory toward Earth
    const trajectoryPoints: THREE.Vector3[] = [];
    const segments = 100;
    const angleRad = (angle * Math.PI) / 180;
    
    // Start position: far away in space
    const startDistance = 250;
    const startX = startDistance * Math.cos(angleRad);
    const startY = startDistance * Math.sin(angleRad);
    const startZ = startDistance * 0.3;
    
    // End position: Earth's surface
    const earthRadius = 20;
    const endX = earthRadius * Math.cos(angleRad) * 0.1;
    const endY = earthRadius * Math.sin(angleRad) * 0.1;
    const endZ = 0;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = startX + (endX - startX) * t;
      const y = startY + (endY - startY) * t;
      const z = startZ + (endZ - startZ) * t;
      trajectoryPoints.push(new THREE.Vector3(x, y, z));
    }

    // Position asteroid at start
    asteroid.position.copy(trajectoryPoints[0]);

    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 2000; i++) {
        starVertices.push((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 1.5 })));

    sceneRef.current = {
      scene, camera, renderer, earth, clouds, controls, asteroid, trajectoryPoints,
      animationId: null,
      time: 0,
    };

    const animate = () => {
      if (!sceneRef.current) return;
      sceneRef.current.animationId = requestAnimationFrame(animate);

      if (isPlaying && isAnimating) {
        sceneRef.current.earth.rotation.y += 0.001 * animationSpeed;
        sceneRef.current.clouds.rotation.y += 0.0013 * animationSpeed;

        if (phase === 'approaching') {
          // Accelerating approach
          sceneRef.current.time += 0.015 * animationSpeed;
          const t = Math.min(sceneRef.current.time, 1);
          const index = Math.floor(t * (segments - 1));
          const point = sceneRef.current.trajectoryPoints[index];
          if (point) {
            sceneRef.current.asteroid.visible = true;
            sceneRef.current.asteroid.position.copy(point);
            sceneRef.current.asteroid.scale.setScalar(1);
            // Add heat glow as it approaches
            const glowIntensity = t * 0.3;
            (sceneRef.current.asteroid.material as THREE.MeshPhongMaterial).emissive.setHex(
              t > 0.7 ? 0xff4400 : 0x000000
            );
            (sceneRef.current.asteroid.material as THREE.MeshPhongMaterial).emissiveIntensity = glowIntensity;
          }
        } else if (phase === 'impact') {
          // Impact moment - asteroid at surface with bright flash
          const impactPoint = sceneRef.current.trajectoryPoints[segments - 1];
          if (impactPoint) {
            sceneRef.current.asteroid.visible = true;
            sceneRef.current.asteroid.position.copy(impactPoint);
            (sceneRef.current.asteroid.material as THREE.MeshPhongMaterial).emissive.setHex(0xffff00);
            (sceneRef.current.asteroid.material as THREE.MeshPhongMaterial).emissiveIntensity = 2;
            sceneRef.current.asteroid.scale.setScalar(3);
          }
        } else if (phase === 'analyzing' || phase === 'finished') {
          // Hide asteroid after impact
          sceneRef.current.asteroid.visible = false;
        } else if (phase === 'idle') {
          // Show asteroid at starting position
          sceneRef.current.time = 0;
          const startPoint = sceneRef.current.trajectoryPoints[0];
          if (startPoint) {
            sceneRef.current.asteroid.position.copy(startPoint);
            sceneRef.current.asteroid.visible = true;
            sceneRef.current.asteroid.scale.setScalar(1);
            (sceneRef.current.asteroid.material as THREE.MeshPhongMaterial).emissive.setHex(0x000000);
            (sceneRef.current.asteroid.material as THREE.MeshPhongMaterial).emissiveIntensity = 0;
          }
        }
      }

      sceneRef.current.controls.update();
      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !sceneRef.current) return;
      sceneRef.current.camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        if (sceneRef.current.animationId) cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        if (mountRef.current && sceneRef.current.renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, [asteroidDiameter, velocity, angle, isPlaying, animationSpeed, isAnimating, phase]);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <div className="bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <span className="text-sm">Speed:</span>
          {[1, 10, 100].map((speed) => (
            <button
              key={speed}
              onClick={() => setAnimationSpeed(speed)}
              className={`px-2 py-1 rounded ${
                animationSpeed === speed ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } transition-colors text-sm`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
