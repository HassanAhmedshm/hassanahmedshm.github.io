uniform float u_time;
uniform float u_glitchIntensity;

varying vec2 vUv;
varying float vGlitch;
varying vec3 vPosition;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.13);
  p3 += dot(p3, p3.yzx + 3.333);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vUv = uv;
  vGlitch = u_glitchIntensity;
  vPosition = position;
  
  vec3 pos = position;
  
  // Only apply glitch when intensity > 0
  if (u_glitchIntensity > 0.0) {
    // Horizontal displacement
    float row = floor(pos.y * 15.0);
    float horizontalShift = hash(vec2(row, floor(u_time * 12.0)));
    horizontalShift = (horizontalShift - 0.5) * 2.0;
    pos.x += horizontalShift * u_glitchIntensity * 0.6;
    
    // Vertical tearing
    float tear = step(0.93, hash(vec2(u_time * 18.0, pos.y)));
    pos.y += tear * u_glitchIntensity * 0.4;
    
    // Random jitter
    float frameTime = floor(u_time * 30.0) / 30.0;
    float jitterX = hash(vec2(frameTime, pos.x * 50.0)) - 0.5;
    float jitterY = hash(vec2(frameTime, pos.y * 50.0)) - 0.5;
    pos.xy += vec2(jitterX, jitterY) * u_glitchIntensity * 0.2;
  }
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}