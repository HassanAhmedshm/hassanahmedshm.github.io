/* ============================================
   Tesseract.jsx — 4D Hypercube wireframe
   ============================================
   Generates a tesseract (16 vertices, 32 edges),
   rotates in 4D XW/YZ planes, projects to 3D,
   and renders via ShaderMaterial with glitch effects.
   ============================================ */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '../../shaders/glitchVertex.glsl?raw';
import fragmentShader from '../../shaders/glitchFragment.glsl?raw';

/* ---- 4D Geometry ---- */

/**
 * Generate 16 vertices of a unit tesseract.
 * Each vertex is a combination of ±1 across 4 axes (x, y, z, w).
 * Bit-masking trick: bit 0 = x, bit 1 = y, bit 2 = z, bit 3 = w.
 */
function generateVertices4D() {
  const verts = [];
  for (let i = 0; i < 16; i++) {
    verts.push([
      (i & 1) ? 1 : -1,
      (i & 2) ? 1 : -1,
      (i & 4) ? 1 : -1,
      (i & 8) ? 1 : -1,
    ]);
  }
  return verts;
}

/**
 * Generate 32 edges of a tesseract.
 * Two vertices are connected if they differ in exactly one coordinate.
 */
function generateEdges(vertices) {
  const edges = [];
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      let diff = 0;
      for (let k = 0; k < 4; k++) {
        if (vertices[i][k] !== vertices[j][k]) diff++;
      }
      if (diff === 1) edges.push([i, j]);
    }
  }
  return edges;
}

/* ---- 4D Transformations ---- */

/**
 * Rotate a 4D point simultaneously in XW and YZ planes.
 * XW rotation creates the "impossible" 4D spin effect.
 * YZ rotation adds secondary motion for visual complexity.
 */
function rotate4D(v, angleXW, angleYZ) {
  const [x, y, z, w] = v;
  const cXW = Math.cos(angleXW), sXW = Math.sin(angleXW);
  const cYZ = Math.cos(angleYZ), sYZ = Math.sin(angleYZ);
  return [
    x * cXW - w * sXW,     // x rotated in XW
    y * cYZ - z * sYZ,     // y rotated in YZ
    y * sYZ + z * cYZ,     // z rotated in YZ
    x * sXW + w * cXW,     // w rotated in XW
  ];
}

/**
 * Perspective projection from 4D → 3D.
 * Higher `d` = less perspective distortion.
 * Uses the w-axis as the projection dimension.
 */
function project4Dto3D(v, d = 2.5) {
  const [x, y, z, w] = v;
  const scale = d / (d - w);
  return [x * scale, y * scale, z * scale];
}

/* ---- React Component ---- */

export default function Tesseract({ progressRef, vertexDataRef }) {
  const materialRef = useRef();
  const timeRef = useRef(0);

  // Pre-compute geometry data (stable across renders)
  const { vertices4D, edges, positionArray, geometry } = useMemo(() => {
    const vertices4D = generateVertices4D();
    const edges = generateEdges(vertices4D);
    // 32 edges × 2 endpoints × 3 coords = 192 floats
    const positionArray = new Float32Array(edges.length * 2 * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positionArray, 3)
    );
    return { vertices4D, edges, positionArray, geometry };
  }, []);

  // Shader uniforms (object reference stays stable)
  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_glitchIntensity: { value: 0 },
    u_color: { value: new THREE.Color(0x3b82f6) },
  }), []);

  // Animation loop — runs every frame
  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const intensity = progressRef.current.glitchIntensity;

    // 4D rotation — different speeds per plane for organic motion
    const angleXW = t * 0.6;
    const angleYZ = t * 0.4;

    // Rotate all 16 vertices in 4D, then project to 3D
    const projected = vertices4D.map((v) => {
      const rotated = rotate4D(v, angleXW, angleYZ);
      return project4Dto3D(rotated);
    });

    // Fill position buffer with edge endpoint pairs
    let idx = 0;
    for (const [a, b] of edges) {
      positionArray[idx++] = projected[a][0];
      positionArray[idx++] = projected[a][1];
      positionArray[idx++] = projected[a][2];
      positionArray[idx++] = projected[b][0];
      positionArray[idx++] = projected[b][1];
      positionArray[idx++] = projected[b][2];
    }
    geometry.attributes.position.needsUpdate = true;

    // Store positions for explosion capture (read by parent at detonation)
    if (vertexDataRef) {
      vertexDataRef.current.positions = positionArray.slice();
    }

    // Update shader uniforms (no React re-render needed)
    uniforms.u_time.value = t;
    uniforms.u_glitchIntensity.value = intensity;
  });

  return (
    <lineSegments geometry={geometry} scale={0.8}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        linewidth={3}
      />
    </lineSegments>
  );
}
