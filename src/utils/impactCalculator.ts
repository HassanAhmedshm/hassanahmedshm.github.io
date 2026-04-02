export interface AsteroidParams {
  diameter: number;
  velocity: number;
  angle: number;
  density: 'rocky' | 'metallic' | 'icy';
  locationType?: 'land' | 'water';
}

export interface ImpactResults {
  mass: number;
  impactEnergy: number;
  tntEquivalent: number;
  craterDiameter: number;
  craterDepth: number;
  affectedAreaRadius: number;
  fireball: number;
  thermalRadiation: number;
  seismicMagnitude: number;
  casualtyEstimate: number;
  airBlast: number;
  isAirburst: boolean;
  tsunamiRisk: boolean;
}

const DENSITIES = {
  rocky: 3000,
  metallic: 8000,
  icy: 1000,
};

const G = 9.81;

export function calculateImpact(
  params: AsteroidParams,
  population: number = 0
): ImpactResults {
  const { diameter, velocity, angle, density } = params;

  const radius = diameter / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const densityValue = DENSITIES[density];
  const mass = volume * densityValue;

  const velocityMs = velocity * 1000;
  const impactEnergy = 0.5 * mass * Math.pow(velocityMs, 2) * Math.sin((angle * Math.PI) / 180);

  const tntEquivalent = impactEnergy / 4.184e9;

  const craterDiameter = 2 * Math.pow(impactEnergy / (G * densityValue), 0.25);
  const craterDepth = craterDiameter / 3;

  const affectedAreaRadius = Math.pow(tntEquivalent, 0.33) * 1000;

  const fireball = Math.pow(tntEquivalent, 0.4) * 100;

  const thermalRadiation = Math.pow(tntEquivalent, 0.41) * 150;

  const seismicMagnitude = Math.log10(impactEnergy) - 4.8;

  const airBlast = Math.pow(tntEquivalent, 0.33) * 800;

  // Airburst logic: Smaller objects (especially icy/rocky) burst in the atmosphere
  // Metallic ones are more likely to reach the ground
  const strength = density === 'metallic' ? 1e8 : density === 'rocky' ? 1e7 : 1e6;
  const vMs = velocity * 1000;
  const stagnationPressure = densityValue * vMs * vMs;
  
  // Simplified heuristic: if stagnation pressure exceeds strength and asteroid is small
  const isAirburst = diameter < 100 && stagnationPressure > strength * 10;
  
  // Tsunami logic: If it hits water and is large enough to cause displacement
  const tsunamiRisk = params.locationType === 'water' && !isAirburst && tntEquivalent > 10;

  let casualtyEstimate = 0;
  if (population > 0) {
    const affectedArea = Math.PI * Math.pow(affectedAreaRadius, 2);
    const populationDensity = population / 1000000;
    casualtyEstimate = Math.floor(affectedArea * populationDensity * 0.7);
    if (tsunamiRisk) casualtyEstimate *= 1.5; // Tsunami increases danger
  }

  return {
    mass,
    impactEnergy,
    tntEquivalent,
    craterDiameter: isAirburst ? 0 : craterDiameter,
    craterDepth: isAirburst ? 0 : craterDepth,
    affectedAreaRadius,
    fireball: isAirburst ? fireball * 1.5 : fireball, // Airbursts have larger fireballs
    thermalRadiation,
    seismicMagnitude: isAirburst ? 0 : Math.max(0, seismicMagnitude),
    casualtyEstimate,
    airBlast,
    isAirburst,
    tsunamiRisk,
  };
}

export function calculateMitigation(
  energyTons: number,
  daysBeforeImpact: number,
  strategy: 'kinetic' | 'nuclear' | 'gravity'
): {
  deflectionNeeded: number;
  successProbability: number;
  description: string;
} {
  const timeYears = daysBeforeImpact / 365;
  const energyMT = energyTons / 1e6; // Convert tons to megatons

  let baseSuccess = 0;
  let description = '';

  switch (strategy) {
    case 'kinetic':
      // More forgiving curve - viable even with shorter warning times
      baseSuccess = timeYears > 5 ? 90 : timeYears > 3 ? 80 : timeYears > 1 ? 65 : timeYears > 0.5 ? 45 : 25;
      description = 'Launch spacecraft to collide with asteroid, changing its momentum';
      break;
    case 'nuclear':
      // Nuclear is powerful - good success even with less warning
      baseSuccess = timeYears > 2 ? 95 : timeYears > 1 ? 85 : timeYears > 0.5 ? 70 : timeYears > 0.25 ? 50 : 30;
      description = 'Detonate nuclear device near asteroid to vaporize surface material';
      break;
    case 'gravity':
      // Still requires long lead time but more realistic
      baseSuccess = timeYears > 10 ? 95 : timeYears > 7 ? 85 : timeYears > 5 ? 70 : timeYears > 3 ? 45 : 20;
      description = 'Position spacecraft near asteroid to gradually alter trajectory via gravity';
      break;
  }

  // More forgiving energy penalty - smaller asteroids are easier to deflect
  const energyFactor = Math.max(0.3, 1 - (energyMT / 5000));
  const successProbability = Math.min(98, baseSuccess * energyFactor);

  const deflectionNeeded = 0.0001 * Math.sqrt(energyMT) / Math.max(0.1, timeYears);

  return {
    deflectionNeeded,
    successProbability: Math.max(10, successProbability),
    description,
  };
}


export function getHistoricalImpacts() {
  return [
    {
      name: 'Chicxulub Impact',
      year: -65000000,
      diameter: 10000,
      energy: 100000000,
      location: 'Yucatan Peninsula, Mexico',
      effect: 'Dinosaur extinction event',
    },
    {
      name: 'Tunguska Event',
      year: 1908,
      diameter: 60,
      energy: 15,
      location: 'Siberia, Russia',
      effect: '2,000 km² of forest destroyed',
    },
    {
      name: 'Chelyabinsk Meteor',
      year: 2013,
      diameter: 20,
      energy: 0.5,
      location: 'Chelyabinsk, Russia',
      effect: '1,500 injuries, widespread damage',
    },
    {
      name: 'Meteor Crater',
      year: -50000,
      diameter: 50,
      energy: 10,
      location: 'Arizona, USA',
      effect: '1.2 km crater formed',
    },
  ];
}
