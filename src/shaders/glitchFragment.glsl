uniform float u_glitchIntensity;
uniform float u_time;
uniform vec3 u_color;

varying vec2 vUv;
varying float vGlitch;
varying vec3 vPosition;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.13);
  p3 += dot(p3, p3.yzx + 3.333);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec3 color = u_color;
  
  // Only apply glitch effects when intensity > 0
  if (u_glitchIntensity > 0.0) {
    // RGB channel separation
    float separation = u_glitchIntensity * 0.1;
    float timeStep = floor(u_time * 20.0) / 20.0;
    
    float rShift = hash(vec2(timeStep, 1.0)) * separation;
    float bShift = hash(vec2(timeStep, 2.0)) * separation;
    
    color.r += rShift * 2.0;
    color.b += bShift * 2.0;
    
    // Scanline corruption
    float scanY = floor(vPosition.y * 40.0);
    float scanGlitch = hash(vec2(scanY, floor(u_time * 12.0)));
    if (scanGlitch > 0.92) {
      color = mix(color, vec3(1.0), 0.5 * u_glitchIntensity);
    }
    
    // Flickering
    float frameTime = floor(u_time * 30.0) / 30.0;
    float flicker = hash(vec2(frameTime, 0.5));
    color *= 0.85 + flicker * 0.3 * u_glitchIntensity;
  }
  
  gl_FragColor = vec4(color, 0.95);
}