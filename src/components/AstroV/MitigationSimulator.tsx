import { useState } from 'react';
import { Shield, Zap, Radio, TrendingUp } from 'lucide-react';
import { calculateMitigation } from '../../utils/impactCalculator';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSimulation } from '../../contexts/SimulationContext';

export default function MitigationSimulator() {
  const { results } = useSimulation();
  const tntEquivalent = results?.tntEquivalent ?? 0;
  const [strategy, setStrategy] = useState<'kinetic' | 'nuclear' | 'gravity'>('kinetic');
  const [daysBeforeImpact, setDaysBeforeImpact] = useState(1825);
  const [missionStatus, setMissionStatus] = useState<'ready' | 'launching' | 'successful' | 'failed'>('ready');

  const handleLaunch = () => {
    setMissionStatus('launching');
    const m = calculateMitigation(tntEquivalent, daysBeforeImpact, strategy);
    
    setTimeout(() => {
        if (m.successProbability > 50) {
            setMissionStatus('successful');
        } else {
            setMissionStatus('failed');
        }
    }, 2000);
  };

  const mitigation = calculateMitigation(tntEquivalent, daysBeforeImpact, strategy);

  // Success forecast data
  const forecastData = Array.from({ length: 10 }, (_, i) => {
    const days = (i + 1) * 365;
    const m = calculateMitigation(tntEquivalent, days, strategy);
    return {
      years: i + 1,
      probability: m.successProbability,
    };
  });

  const strategies = [
    {
      id: 'kinetic' as const,
      name: 'Kinetic Impact',
      icon: Zap,
      color: 'blue',
      description: 'Launch spacecraft to collide with asteroid, changing its momentum',
      pros: ['Proven technology', 'No nuclear material', 'Predictable results'],
      cons: ['Requires years of warning', 'Less effective on large asteroids'],
    },
    {
      id: 'nuclear' as const,
      name: 'Nuclear Deflection',
      icon: Radio,
      color: 'red',
      description: 'Detonate nuclear device near asteroid to vaporize surface material',
      pros: ['Most powerful option', 'Effective on large asteroids', 'Faster than alternatives'],
      cons: ['Political challenges', 'Risk of fragmentation', 'Radioactive concerns'],
    },
    {
      id: 'gravity' as const,
      name: 'Gravity Tractor',
      icon: Shield,
      color: 'green',
      description: 'Position spacecraft near asteroid to gradually alter trajectory via gravity',
      pros: ['Gentle and controlled', 'No fragmentation risk', 'Precise adjustments'],
      cons: ['Requires decades of warning', 'Only works on smaller asteroids'],
    },
  ];

  const currentStrategy = strategies.find(s => s.id === strategy)!;

  const getSuccessColor = (probability: number) => {
    if (probability >= 70) return 'text-green-400';
    if (probability >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Planetary Defense Strategy</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {strategies.map((strat) => {
            const Icon = strat.icon;
            const isSelected = strategy === strat.id;
            const sColor = strat.color === 'blue' ? 'blue' : strat.color === 'red' ? 'red' : 'green';
            return (
              <button
                key={strat.id}
                onClick={() => {
                    setStrategy(strat.id);
                    setMissionStatus('ready');
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `border-${sColor}-500 bg-${sColor}-500/10`
                    : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? `bg-${sColor}-500/20` : 'bg-gray-800'}`}>
                    <Icon
                      className={isSelected ? `text-${sColor}-400` : 'text-gray-500'}
                      size={20}
                    />
                  </div>
                  <h3 className={`font-bold ${isSelected ? 'text-white' : 'text-gray-400'} text-left`}>{strat.name}</h3>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800">
              <h3 className="font-bold text-white mb-2">{currentStrategy.name}</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{currentStrategy.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-green-400 font-bold text-xs uppercase tracking-wider mb-2">Pros</h4>
                  <ul className="space-y-1">
                    {currentStrategy.pros.map((pro, i) => (
                      <li key={i} className="text-[11px] text-gray-300 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-400 font-bold text-xs uppercase tracking-wider mb-2">Cons</h4>
                  <ul className="space-y-1">
                    {currentStrategy.cons.map((con, i) => (
                      <li key={i} className="text-[11px] text-gray-300 flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">✗</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">Warning Time</label>
                <span className="text-lg font-bold text-blue-400">
                  {(daysBeforeImpact / 365).toFixed(1)} years
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="3650"
                value={daysBeforeImpact}
                onChange={(e) => setDaysBeforeImpact(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Immediate</span>
                <span>10 Years</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/80 rounded-xl p-6 border border-gray-800 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-blue-400" />
              <h3 className="font-bold text-white text-sm">Success Probability Forecast</h3>
            </div>
            <div className="flex-1 min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <XAxis dataKey="years" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#3b82f6' }}
                    labelFormatter={(value) => `${value} Year Warning`}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Success']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="probability" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={false}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Current Odds</p>
                <p className={`text-3xl font-black ${getSuccessColor(mitigation.successProbability)} tracking-tighter`}>
                  {mitigation.successProbability.toFixed(1)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Deflection Required</p>
                <p className="text-lg font-bold text-white">{mitigation.deflectionNeeded.toFixed(4)}°</p>
                
                <button
                    onClick={handleLaunch}
                    disabled={missionStatus === 'launching'}
                    className={`mt-4 w-full px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] ${
                        missionStatus === 'launching' ? 'bg-gray-700 text-gray-400 cursor-wait' :
                        missionStatus === 'successful' ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' :
                        missionStatus === 'failed' ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' :
                        'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
                    }`}
                >
                    {missionStatus === 'ready' && 'Launch Mission'}
                    {missionStatus === 'launching' && 'Mission in Progress...'}
                    {missionStatus === 'successful' && 'Mission Successful!'}
                    {missionStatus === 'failed' && 'Mission Failed'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {mitigation.successProbability < 40 && (
          <div className="mt-8 bg-red-900/20 border border-red-900/30 rounded-xl p-4 flex items-start gap-4">
            <div className="bg-red-900/40 p-2 rounded-lg">
              <Radio size={20} className="text-red-400 animate-pulse" />
            </div>
            <div>
              <p className="text-red-400 text-sm font-bold uppercase tracking-wider mb-1">Low Success Rate Detected</p>
              <p className="text-red-300/80 text-xs leading-relaxed">
                The current warning time is insufficient for a single spacecraft to ensure deflection. 
                Consider initiating a multi-stage kinetic impactor flight or evaluating nuclear standoff options.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
