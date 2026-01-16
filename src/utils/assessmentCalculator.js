
import { differenceInYears, format } from 'date-fns';

export const calculateBazi = (birthDate) => {
  const year = new Date(birthDate).getFullYear();
  const heavenlyStems = ['Yang Wood', 'Yin Wood', 'Yang Fire', 'Yin Fire', 'Yang Earth', 'Yin Earth', 'Yang Metal', 'Yin Metal', 'Yang Water', 'Yin Water'];
  const earthlyBranches = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  
  const stem = heavenlyStems[year % 10];
  const branch = earthlyBranches[year % 12];
  
  const narratives = [
    `${stem} ${branch} soul radiates balance, seeking harmony through transformative cosmic alignment and spiritual depth.`,
    `${stem} ${branch} essence embodies wisdom, nurturing connections through intuitive understanding and celestial resonance patterns.`,
    `${stem} ${branch} spirit channels energy, manifesting destiny through powerful elemental forces and universal guidance.`
  ];
  
  return {
    type: `${stem} ${branch}`,
    element: stem.split(' ')[1],
    animal: branch,
    narrative: narratives[year % 3],
    score: Math.floor(Math.random() * 30) + 70
  };
};

export const calculateVedic = (birthDate) => {
  const day = new Date(birthDate).getDate();
  const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha'];
  const nakshatra = nakshatras[day % nakshatras.length];
  
  const narratives = [
    `${nakshatra} nakshatra bestows divine wisdom, illuminating pathways toward profound soul connections and spiritual awakening.`,
    `${nakshatra} energy resonates deeply, fostering relationships built on karmic understanding and celestial harmonious vibrations.`,
    `${nakshatra} influence channels cosmic forces, creating magnetic attraction through ancient Vedic nerve force alignment.`
  ];
  
  return {
    nakshatra,
    ruling: 'Moon',
    narrative: narratives[day % 3],
    nerveForce: Math.floor(Math.random() * 25) + 75
  };
};

export const calculateNumerology = (birthDate, name) => {
  const calculateNumber = (str) => {
    const sum = str.split('').reduce((acc, char) => {
      const num = char.charCodeAt(0) - 64;
      return acc + (num > 0 && num <= 26 ? num : 0);
    }, 0);
    return sum > 9 ? calculateNumber(sum.toString()) : sum;
  };
  
  const birthDateStr = format(new Date(birthDate), 'ddMMyyyy');
  const lifePath = calculateNumber(birthDateStr);
  const destiny = calculateNumber(name.toUpperCase().replace(/[^A-Z]/g, ''));
  
  const narratives = [
    `Life path ${lifePath} and destiny ${destiny} merge beautifully, creating harmonious synchronization for deep soul connections.`,
    `Numbers ${lifePath} and ${destiny} vibrate powerfully, attracting relationships aligned with purpose and spiritual growth journey.`,
    `Numerical essence ${lifePath}/${destiny} radiates magnetic energy, manifesting connections through universal mathematical divine patterns.`
  ];
  
  return {
    lifePath,
    destiny,
    soul: calculateNumber(name.split(' ')[0].toUpperCase()),
    narrative: narratives[lifePath % 3],
    synchronization: Math.floor(Math.random() * 30) + 70
  };
};

export const calculateEnneagram = (birthDate) => {
  const month = new Date(birthDate).getMonth();
  const types = [
    { type: 1, name: 'The Reformer', core: 'Principled and purposeful' },
    { type: 2, name: 'The Helper', core: 'Generous and caring' },
    { type: 3, name: 'The Achiever', core: 'Adaptable and success-oriented' },
    { type: 4, name: 'The Individualist', core: 'Sensitive and creative' },
    { type: 5, name: 'The Investigator', core: 'Perceptive and innovative' },
    { type: 6, name: 'The Loyalist', core: 'Committed and security-oriented' },
    { type: 7, name: 'The Enthusiast', core: 'Spontaneous and versatile' },
    { type: 8, name: 'The Challenger', core: 'Powerful and decisive' },
    { type: 9, name: 'The Peacemaker', core: 'Receptive and agreeable' }
  ];
  
  const selected = types[month % 9];
  
  const narratives = [
    `Type ${selected.type} ${selected.name} embodies ${selected.core} essence, seeking partners who appreciate authentic emotional depth.`,
    `${selected.name} personality radiates ${selected.core} energy, attracting connections through genuine understanding and mutual growth.`,
    `Type ${selected.type} soul expresses ${selected.core} nature, fostering relationships built on complementary strengths and values.`
  ];
  
  return {
    ...selected,
    wing: month % 2 === 0 ? `${selected.type}w${selected.type + 1}` : `${selected.type}w${selected.type - 1}`,
    narrative: narratives[month % 3],
    pairing: Math.floor(Math.random() * 25) + 75
  };
};

export const calculateTarot = (birthDate) => {
  const day = new Date(birthDate).getDate();
  const archetypes = [
    { card: 'The Magician', archetype: 'Manifestation and power' },
    { card: 'The High Priestess', archetype: 'Intuition and mystery' },
    { card: 'The Empress', archetype: 'Abundance and nurturing' },
    { card: 'The Emperor', archetype: 'Authority and structure' },
    { card: 'The Lovers', archetype: 'Union and choices' },
    { card: 'The Chariot', archetype: 'Willpower and determination' },
    { card: 'Strength', archetype: 'Courage and compassion' },
    { card: 'The Star', archetype: 'Hope and inspiration' }
  ];
  
  const selected = archetypes[day % archetypes.length];
  
  const narratives = [
    `${selected.card} archetype embodies ${selected.archetype}, creating powerful resonance with kindred spirits seeking transformation.`,
    `Guided by ${selected.card} energy of ${selected.archetype}, attracting relationships aligned with destined spiritual purpose.`,
    `${selected.card} essence channels ${selected.archetype}, manifesting connections through mystical archetypal cosmic resonance patterns.`
  ];
  
  return {
    ...selected,
    element: 'Major Arcana',
    narrative: narratives[day % 3],
    resonance: Math.floor(Math.random() * 30) + 70
  };
};

export const calculateHumanDesign = (birthDate) => {
  const day = new Date(birthDate).getDate();
  const types = [
    { type: 'Manifestor', strategy: 'To inform', authority: 'Emotional' },
    { type: 'Generator', strategy: 'To respond', authority: 'Sacral' },
    { type: 'Manifesting Generator', strategy: 'To respond and inform', authority: 'Sacral' },
    { type: 'Projector', strategy: 'To wait for invitation', authority: 'Splenic' },
    { type: 'Reflector', strategy: 'To wait lunar cycle', authority: 'Lunar' }
  ];
  
  const selected = types[day % types.length];
  
  const narratives = [
    `${selected.type} design with ${selected.authority} authority creates unique energetic signature attracting compatible authentic partnerships.`,
    `${selected.type} strategy "${selected.strategy}" guides relationship formation through aligned human design compatibility patterns.`,
    `${selected.type} essence resonates ${selected.authority} authority, manifesting connections through energetic frequency and type compatibility.`
  ];
  
  return {
    ...selected,
    profile: `${(day % 6) + 1}/${((day + 3) % 6) + 1}`,
    narrative: narratives[day % 3],
    compatibility: Math.floor(Math.random() * 30) + 70
  };
};

export const calculateGreekGear = (birthDate, name) => {
  const gears = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
  const nameValue = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gear = gears[nameValue % gears.length];
  
  const narratives = [
    `${gear} gear configuration optimizes relationship mechanics through precise compatibility alignment and synchronized connection protocols.`,
    `${gear} mechanism channels partnership dynamics, creating harmonious matching precision through Greek geometric compatibility patterns.`,
    `${gear} system resonates perfectly, establishing relationships through mathematically calculated Greek gear matching precision algorithms.`
  ];
  
  return {
    gear,
    precision: Math.floor(Math.random() * 15) + 85,
    mechanism: 'Synchronized',
    narrative: narratives[nameValue % 3],
    matching: Math.floor(Math.random() * 20) + 80
  };
};

export const generateAssessments = (birthDate, name) => {
  if (!birthDate || !name) return null;
  
  return {
    bazi: calculateBazi(birthDate),
    vedic: calculateVedic(birthDate),
    numerology: calculateNumerology(birthDate, name),
    enneagram: calculateEnneagram(birthDate),
    tarot: calculateTarot(birthDate),
    humanDesign: calculateHumanDesign(birthDate),
    greekGear: calculateGreekGear(birthDate, name)
  };
};
