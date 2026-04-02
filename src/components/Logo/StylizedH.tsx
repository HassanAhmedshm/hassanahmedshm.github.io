// Stylized H Logo Options

// Option 1: Geometric Lines H
export const GeometricH = ({ size = 40, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Left vertical bar */}
    <rect x="15" y="15" width="12" height="70" fill="currentColor" />
    {/* Right vertical bar */}
    <rect x="73" y="15" width="12" height="70" fill="currentColor" />
    {/* Middle horizontal bar */}
    <rect x="27" y="44" width="46" height="12" fill="currentColor" />
  </svg>
);

// Option 2: Rounded Modern H
export const RoundedH = ({ size = 40, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M20 15 C20 15, 20 50, 20 50 C20 50, 20 85, 20 85 M80 15 C80 15, 80 50, 80 50 C80 50, 80 85, 80 85 M20 50 L80 50" 
      stroke="currentColor" 
      strokeWidth="12" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Option 3: Slanted Tech H
export const TechH = ({ size = 40, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Left bar with slant */}
    <path d="M25 15 L15 85 L27 85 L37 15 Z" fill="currentColor" />
    {/* Right bar with slant */}
    <path d="M75 15 L65 85 L77 85 L87 15 Z" fill="currentColor" />
    {/* Middle connecting bar */}
    <path d="M33 44 L30 56 L70 56 L73 44 Z" fill="currentColor" />
  </svg>
);

// Option 4: Minimal Line H
export const MinimalH = ({ size = 40, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M25 20 L25 80 M75 20 L75 80 M25 50 L75 50" 
      stroke="currentColor" 
      strokeWidth="8" 
      strokeLinecap="round"
    />
  </svg>
);

// Option 5: Hexagon H
export const HexagonH = ({ size = 40, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Hexagon outline */}
    <path 
      d="M50 5 L85 27.5 L85 72.5 L50 95 L15 72.5 L15 27.5 Z" 
      stroke="currentColor" 
      strokeWidth="3"
      fill="none"
    />
    {/* H inside */}
    <path 
      d="M35 30 L35 70 M65 30 L65 70 M35 50 L65 50" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round"
    />
  </svg>
);

// Option 6: 3D Isometric H
export const IsometricH = ({ size = 40, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 110" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Left pillar - front face */}
    <path d="M20 45 L20 85 L30 90 L30 50 Z" fill="currentColor" opacity="0.9" />
    {/* Left pillar - top face */}
    <path d="M20 45 L30 40 L40 45 L30 50 Z" fill="currentColor" opacity="0.7" />
    {/* Left pillar - side face */}
    <path d="M30 40 L40 45 L40 85 L30 90 Z" fill="currentColor" opacity="0.5" />
    
    {/* Right pillar - front face */}
    <path d="M60 45 L60 85 L70 90 L70 50 Z" fill="currentColor" opacity="0.9" />
    {/* Right pillar - top face */}
    <path d="M60 45 L70 40 L80 45 L70 50 Z" fill="currentColor" opacity="0.7" />
    {/* Right pillar - side face */}
    <path d="M70 40 L80 45 L80 85 L70 90 Z" fill="currentColor" opacity="0.5" />
    
    {/* Middle bar - front face */}
    <path d="M30 62 L30 72 L70 72 L70 62 Z" fill="currentColor" opacity="0.9" />
    {/* Middle bar - top face */}
    <path d="M30 62 L40 57 L80 57 L70 62 Z" fill="currentColor" opacity="0.7" />
    {/* Middle bar - side face */}
    <path d="M70 62 L80 57 L80 67 L70 72 Z" fill="currentColor" opacity="0.5" />
  </svg>
);

// Option 7: Gradient Modern H
export const GradientH = ({ size = 40, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="hGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <path 
      d="M20 15 L20 85 M80 15 L80 85 M20 50 L80 50" 
      stroke="url(#hGradient)" 
      strokeWidth="14" 
      strokeLinecap="round"
    />
  </svg>
);

// Option 8: Circuit Board H
export const CircuitH = ({ size = 40, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Main H structure */}
    <path d="M25 20 L25 80 M75 20 L75 80 M25 50 L75 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
    {/* Circuit nodes */}
    <circle cx="25" cy="20" r="4" fill="currentColor" />
    <circle cx="25" cy="50" r="4" fill="currentColor" />
    <circle cx="25" cy="80" r="4" fill="currentColor" />
    <circle cx="75" cy="20" r="4" fill="currentColor" />
    <circle cx="75" cy="50" r="4" fill="currentColor" />
    <circle cx="75" cy="80" r="4" fill="currentColor" />
    <circle cx="50" cy="50" r="4" fill="currentColor" />
  </svg>
);
