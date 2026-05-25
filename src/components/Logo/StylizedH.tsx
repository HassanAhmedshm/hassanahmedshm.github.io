
export const IsometricH = ({ size = 1, strokeWidth = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className={className} style={{ width: size + 'px', height: size + 'px', maxWidth: size + 'px' }}>
    <path 
      d="M 262.5,95.6 
         C 262.5,175.6 252.5,245.6 247.5,275.6 
         C 242.5,310.6 202.5,313.6 197.5,295.6 
         C 192.5,277.6 227.5,250.6 262.5,240.6 
         C 292.5,230.6 312.5,220.6 337.5,210.6 
         C 365.0,199.6 395.0,130.6 382.5,105.6 
         C 370.0,80.6 317.5,140.0 317.5,235.6 
         C 317.5,295.6 327.5,355.6 307.5,380.6 
         C 287.5,410.6 202.5,420.6 157.5,360.6 
         C 117.5,305.6 117.5,205.6 167.5,150.6 
         C 192.5,125.6 217.5,120.6 232.5,130.6"
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth}
      strokeLinecap="round" 
      strokeLinejoin="round" />
  </svg>
);
