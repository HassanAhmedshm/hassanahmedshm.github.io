import { useState } from 'react';
import { Target, Shield, BarChart3, Map, Home } from 'lucide-react';
import SolarSystemViewer from '../components/AstroV/SolarSystemViewer';
import ControlPanel from '../components/AstroV/ControlPanel';
import ImpactResultsDashboard from '../components/AstroV/ImpactResults';
import WorldMap from '../components/AstroV/WorldMap';
import MitigationSimulator from '../components/AstroV/MitigationSimulator';
import EducationalMode from '../components/AstroV/EducationalMode';
import DataVisualization from '../components/AstroV/DataVisualization';
import { SimulationProvider, useSimulation } from '../contexts/SimulationContext';

type Tab = 'home' | 'impact' | 'map' | 'mitigation' | 'data';

function AstroVContent() {
  const {
    params,
    results,
    simulationPhase,
    impactLocation,
    setParams,
    setSimulationPhase,
    handleSimulate,
    handleLocationSelect,
  } = useSimulation();

  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [educationalMode, setEducationalMode] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSimulateWithShake = () => {
    handleSimulate();
    setTimeout(() => {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 1000);
    }, 3000);
  };

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'impact' as const, label: 'Impact Analysis', icon: Target },
    { id: 'map' as const, label: 'World Map', icon: Map },
    { id: 'mitigation' as const, label: 'Mitigation', icon: Shield },
    { id: 'data' as const, label: 'Data Analysis', icon: BarChart3 },
  ];

  return (
    <div className={`min-h-screen bg-gray-950 text-white selection:bg-blue-500/30 transition-all ${isShaking ? 'shake' : ''}`}>
      {simulationPhase === 'impact' && <div className="impact-flash" />}
      <div className="starfield" />
      
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 z-40">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <img src="/images/astrov.png" alt="AstroV Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">AstroV</h1>
                <p className="text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-widest">Asteroid Impact Simulator</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <a 
                href="GITHUB_REPO_URL_HERE" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-white p-2.5 md:px-6 md:py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
                title="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="hidden md:inline">GitHub</span>
              </a>
              <a 
                href="/" 
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-white p-2.5 md:px-6 md:py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
                title="Portfolio"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span className="hidden md:inline">Portfolio</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-gray-900/60 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-30">
        <div className="container mx-auto px-2 md:px-4">
          <div className="flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-6 py-2.5 md:py-3 font-medium transition-all whitespace-nowrap text-xs md:text-sm rounded-lg md:rounded-none ${
                    activeTab === tab.id
                      ? 'text-blue-400 md:border-b-2 border-blue-400 bg-blue-500/20 md:bg-blue-500/10'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-20">
            {/* Hero Section with Space Background */}
            <section className="relative overflow-hidden rounded-3xl h-[600px] flex items-center justify-center">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&q=80')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-950" />
              
              {/* Animated Stars Overlay */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '20%', left: '10%' }} />
                <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '40%', left: '80%', animationDelay: '0.5s' }} />
                <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '60%', left: '30%', animationDelay: '1s' }} />
                <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '80%', left: '70%', animationDelay: '1.5s' }} />
              </div>

              {/* Content */}
              <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
                <div className="mb-8 inline-block">
                  <div className="bg-blue-600/20 border border-blue-500/30 rounded-full px-6 py-2 backdrop-blur-sm">
                    <p className="text-blue-300 text-sm font-bold uppercase tracking-widest">NASA Space Apps Challenge 2025</p>
                  </div>
                </div>
                <h1 className="text-7xl md:text-8xl font-black text-white mb-6 tracking-tight leading-none">
                  Planetary Defense
                  <span className="block text-blue-400">Simulator</span>
                </h1>
                <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Experience real asteroid impact scenarios. Analyze threats. Test defense strategies. 
                  <span className="block text-blue-400 font-semibold mt-2">Protect our planet.</span>
                </p>
                <div className="flex gap-6 justify-center flex-wrap">
                  <button 
                    onClick={() => setActiveTab('impact')} 
                    className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-xl font-black text-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
                  >
                    <Target size={28} />
                    Launch Simulation
                  </button>
                  <button 
                    onClick={() => setActiveTab('mitigation')} 
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all flex items-center gap-3"
                  >
                    <Shield size={28} />
                    Defense Systems
                  </button>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-white mb-4">Explore the Simulator</h2>
                <p className="text-gray-400 text-lg">Four powerful tools to understand asteroid threats</p>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { icon: Target, label: 'Impact Analysis', desc: 'Simulate asteroid collisions with Earth', tab: 'impact' as const, color: 'red' },
                  { icon: Map, label: 'Location Targeting', desc: 'Choose impact sites and see effects', tab: 'map' as const, color: 'green' },
                  { icon: Shield, label: 'Mitigation Plans', desc: 'Test planetary defense systems', tab: 'mitigation' as const, color: 'blue' },
                  { icon: BarChart3, label: 'Data Insights', desc: 'Analyze impact statistics', tab: 'data' as const, color: 'purple' },
                ].map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveTab(feature.tab)}
                      className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 hover:bg-gray-900/80 transition-all group text-left relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className={`text-${feature.color}-400`} size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{feature.label}</h3>
                        <p className="text-sm text-gray-400">{feature.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* NASA & Science Section with Images */}
            <section className="grid md:grid-cols-2 gap-8">
              <div className="relative overflow-hidden rounded-2xl group">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
                <div className="relative p-8 h-full flex flex-col justify-end min-h-[400px]">
                  <h3 className="text-3xl font-black text-white mb-4">Real Science, Real Data</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Built on NASA's Near-Earth Object data and validated impact physics models. Every simulation uses real-world calculations for energy, crater formation, and atmospheric effects.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-gray-200 font-medium">NASA NEO tracking data</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-gray-200 font-medium">Physics-based impact modeling</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-gray-200 font-medium">Validated defense strategies</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl group">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&q=80')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-950 via-orange-950/80 to-transparent" />
                <div className="relative p-8 h-full flex flex-col justify-end min-h-[400px]">
                  <h3 className="text-3xl font-black text-orange-400 mb-4">Why This Matters</h3>
                  <p className="text-gray-200 mb-6 leading-relaxed">
                    Over 30,000 near-Earth asteroids have been discovered. Understanding impact scenarios helps us prepare planetary defense systems and protect our future.
                  </p>
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-5 border border-orange-500/20">
                    <p className="text-orange-300 font-mono text-sm leading-relaxed">
                      "The dinosaurs didn't have a space program. We do."
                    </p>
                    <p className="text-orange-400/70 text-xs mt-2 font-bold">— NASA</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-3xl p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-white mb-4">By The Numbers</h2>
                <p className="text-gray-400 text-lg">The reality of near-Earth objects</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-6xl font-black text-blue-400 mb-2">30,000+</div>
                  <p className="text-gray-300 font-medium">Near-Earth Asteroids Discovered</p>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-black text-purple-400 mb-2">100+</div>
                  <p className="text-gray-300 font-medium">Tons Hit Earth Daily</p>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-black text-orange-400 mb-2">66M</div>
                  <p className="text-gray-300 font-medium">Years Since Last Major Impact</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden h-[500px] relative">
                <SolarSystemViewer
                  asteroidDiameter={params.diameter}
                  velocity={params.velocity}
                  angle={params.angle}
                  phase={simulationPhase}
                />
                
                {simulationPhase === 'idle' && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
                    <button 
                      onClick={handleSimulateWithShake}
                      className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 rounded-full text-2xl font-black uppercase tracking-widest shadow-[0_0_50px_rgba(220,38,38,0.5)] transition-all transform hover:scale-110 active:scale-95 flex items-center gap-4"
                    >
                      <Target size={32} />
                      Simulate Impact
                    </button>
                  </div>
                )}

                {(simulationPhase === 'approaching' || simulationPhase === 'impact') && (
                  <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-red-500/20 rounded-full animate-[ping_3s_linear_infinite]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-red-500/10 rounded-full animate-[ping_4s_linear_infinite]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-red-500/30 rounded-full animate-[ping_2s_linear_infinite]" />
                    
                    <div className="absolute top-4 left-4 z-20 bg-red-600/20 border border-red-500/50 p-4 rounded-xl backdrop-blur-md animate-pulse">
                      <p className="text-red-400 font-bold uppercase tracking-widest text-xs mb-1">Alert: Collision Course</p>
                      <p className="text-white font-black text-xl italic uppercase">Impact Imminent</p>
                    </div>

                    <div className="absolute bottom-4 right-4 text-red-500 font-mono text-sm">
                        ALTITUDE: {simulationPhase === 'approaching' ? '324,500 KM' : 'impact'} <br/>
                        VELOCITY: {params.velocity} KM/S
                    </div>
                  </div>
                )}
              </div>

              {results && (simulationPhase === 'analyzing' || simulationPhase === 'finished') && (
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                  <ImpactResultsDashboard results={results} />
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-4">
              <ControlPanel 
                params={params} 
                onParamsChange={setParams} 
                isDisabled={simulationPhase !== 'idle' && simulationPhase !== 'finished'}
              />
              
              {simulationPhase === 'finished' && (
                <div className="space-y-4">
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3">What's Next?</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('map')}
                        className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-between group"
                      >
                        <span className="flex items-center gap-2">
                          <Map size={20} />
                          View Impact Zone
                        </span>
                        <span className="text-xs opacity-70 group-hover:opacity-100">→</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('mitigation')}
                        className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-between group"
                      >
                        <span className="flex items-center gap-2">
                          <Shield size={20} />
                          Try Mitigation
                        </span>
                        <span className="text-xs opacity-70 group-hover:opacity-100">→</span>
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSimulationPhase('idle')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase tracking-wider transition-all shadow-lg hover:shadow-xl"
                  >
                    Reset & Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'map' && results && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden h-[600px]">
              <WorldMap
                impactLocation={impactLocation}
                onLocationSelect={handleLocationSelect}
                affectedRadius={results.affectedAreaRadius / 1000}
                fireballRadius={results.fireball}
                thermalRadius={results.thermalRadiation}
                locationType={params.locationType || 'land'}
                onLocationTypeChange={(type) => setParams({ ...params, locationType: type })}
                phase={simulationPhase}
              />
            </div>
            <ImpactResultsDashboard results={results} />
          </div>
        )}

        {activeTab === 'mitigation' && results && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MitigationSimulator tntEquivalent={results.tntEquivalent} />
            </div>
            <div className="lg:col-span-1">
              <ControlPanel params={params} onParamsChange={setParams} />
            </div>
          </div>
        )}

        {activeTab === 'data' && results && (
          <div className="space-y-6">
            <DataVisualization results={results} />
          </div>
        )}
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 items-center border-b border-gray-800 pb-8 mb-8">
            <div className="flex items-center gap-3">
              <img src="/images/astrov.png" alt="AstroV Logo" className="w-10 h-10 object-contain grayscale opacity-50" />
              <span className="text-xl font-bold text-gray-500 tracking-tighter">AstroV</span>
            </div>
            <div className="text-center">
              <p className="text-blue-400 font-bold mb-1">NASA Space Apps Challenge 2025</p>
              <p className="text-gray-500 text-xs italic">"Protecting Earth through Science and Simulation"</p>
            </div>
            <div className="text-right text-gray-400">
              <p className="text-sm font-medium text-gray-500">Real Physics • Real Data</p>
              <p className="text-xs">Based on scientific impact cratering models</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs uppercase tracking-widest">
            <p>© 2025 AstroV Team • Open Science Project</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
              <a href="#" className="hover:text-blue-400 transition-colors">NASA NEO API</a>
              <a href="#" className="hover:text-blue-400 transition-colors">USGS Data</a>
            </div>
          </div>
        </div>
      </footer>

      <EducationalMode
        isEnabled={educationalMode}
        onToggle={() => setEducationalMode(!educationalMode)}
      />
    </div>
  );
}

function App() {
  return (
    <SimulationProvider>
      <AstroVContent />
    </SimulationProvider>
  );
}

export default App;