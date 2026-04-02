import { 
  GeometricH, 
  RoundedH, 
  TechH, 
  MinimalH, 
  HexagonH, 
  IsometricH, 
  GradientH,
  CircuitH 
} from './StylizedH';

const LogoShowcase = () => {
  const logos = [
    { name: 'Geometric Lines', Component: GeometricH, desc: 'Clean, modern, professional' },
    { name: 'Rounded Modern', Component: RoundedH, desc: 'Friendly, approachable' },
    { name: 'Slanted Tech', Component: TechH, desc: 'Dynamic, forward-thinking' },
    { name: 'Minimal Line', Component: MinimalH, desc: 'Simple, elegant' },
    { name: 'Hexagon', Component: HexagonH, desc: 'Tech-focused, structured' },
    { name: 'Isometric 3D', Component: IsometricH, desc: 'Dimensional, unique' },
    { name: 'Gradient', Component: GradientH, desc: 'Colorful, modern' },
    { name: 'Circuit Board', Component: CircuitH, desc: 'Developer-focused, techy' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Stylized H Logo Options</h1>
        <p className="text-gray-400 mb-12">Choose your favorite design</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {logos.map(({ name, Component, desc }) => (
            <div key={name} className="flex flex-col items-center">
              <div className="bg-gray-900 rounded-2xl p-8 mb-4 w-full aspect-square flex items-center justify-center border border-gray-800 hover:border-blue-500 transition-colors">
                <Component size={80} className="text-white" />
              </div>
              <h3 className="font-bold text-center mb-1">{name}</h3>
              <p className="text-sm text-gray-400 text-center">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Preview in Context</h2>
          <div className="space-y-6">
            {logos.slice(0, 4).map(({ name, Component }) => (
              <div key={name} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                <Component size={40} className="text-blue-400" />
                <div>
                  <h3 className="font-bold">Hassan Ahmed</h3>
                  <p className="text-sm text-gray-400">Full Stack Developer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcase;
