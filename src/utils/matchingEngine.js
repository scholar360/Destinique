
export const calculateCompatibility = (user1Assessments, user2Assessments) => {
  if (!user1Assessments || !user2Assessments) {
    return {
      overall: 0,
      breakdown: {},
      narrative: "Complete your assessments to see compatibility scores."
    };
  }

  // 1. Physical Compatibility (Bio-Age + Stamina)
  const bioAgeDiff = Math.abs(user1Assessments.bioAge - user2Assessments.bioAge);
  const staminaDiff = Math.abs(user1Assessments.stamina - user2Assessments.stamina);
  const physicalScore = Math.max(0, 100 - (bioAgeDiff * 2) - (staminaDiff * 5));

  // 2. Metaphysical (Bazi + Vedic)
  const baziScore = calculateBaziCompatibility(user1Assessments.bazi, user2Assessments.bazi);
  const vedicScore = calculateVedicCompatibility(user1Assessments.vedic, user2Assessments.vedic);
  const metaphysicalScore = Math.round((baziScore + vedicScore) / 2);

  // 3. Psychological (Enneagram + Tarot)
  const enneagramScore = calculateEnneagramCompatibility(user1Assessments.enneagram, user2Assessments.enneagram);
  const tarotScore = calculateTarotCompatibility(user1Assessments.tarot, user2Assessments.tarot);
  const psychologicalScore = Math.round((enneagramScore + tarotScore) / 2);

  // 4. Sync (Greek Gear)
  const syncScore = calculateGreekGearCompatibility(user1Assessments.greekGear, user2Assessments.greekGear);

  // 5. Horoscope
  const horoscopeScore = calculateHoroscopeCompatibility(user1Assessments.horoscope, user2Assessments.horoscope);

  // 6. Numerology
  const numerologyScore = calculateNumerologyCompatibility(user1Assessments.numerology, user2Assessments.numerology);

  // 7. Human Design
  const humanDesignScore = calculateHumanDesignCompatibility(user1Assessments.humanDesign, user2Assessments.humanDesign);

  // Weighted Average
  const overall = Math.round(
    (physicalScore * 0.10) +
    (metaphysicalScore * 0.15) +
    (psychologicalScore * 0.15) +
    (syncScore * 0.15) +
    (horoscopeScore * 0.15) +
    (numerologyScore * 0.15) +
    (humanDesignScore * 0.15)
  );

  const breakdown = {
    physical: { 
      score: physicalScore, 
      narrative: `Physical resonance based on bio-age proximity (${bioAgeDiff} yrs) and energy stamina alignment.`
    },
    metaphysical: { 
      score: metaphysicalScore, 
      narrative: `Cosmic blueprint alignment through Bazi elements and Vedic nerve force connection.`
    },
    psychological: { 
      score: psychologicalScore, 
      narrative: `Deep personality resonance combining Enneagram motivations and Archetypal wisdom.`
    },
    sync: { 
      score: syncScore, 
      narrative: `Operational harmony derived from Greek Gear mechanics precision.`
    },
    horoscope: {
      score: horoscopeScore,
      narrative: `Astrological sign compatibility based on elemental and modal interactions.`
    },
    numerology: {
      score: numerologyScore,
      narrative: `Life path vibration synchronization and destiny number harmony.`
    },
    humanDesign: {
      score: humanDesignScore,
      narrative: `Energetic type strategy and authority alignment.`
    }
  };

  const narrative = generateCompatibilityNarrative(overall);

  return { overall, breakdown, narrative };
};

// Helper Functions
const calculateHoroscopeCompatibility = (h1, h2) => {
  if (!h1 || !h2) return 50;
  const elements = { 'Fire': 0, 'Earth': 1, 'Air': 2, 'Water': 3 };
  const diff = Math.abs(elements[h1.element] - elements[h2.element]);
  // Same element (0) = 90, Complementary (2) = 85, Clash (1/3) = 60
  if (diff === 0) return 90;
  if (diff === 2) return 85;
  return 60 + Math.floor(Math.random() * 10);
};

const calculateBaziCompatibility = (bazi1, bazi2) => {
  if (!bazi1 || !bazi2) return 50;
  const scores = { 'Wood': {'Fire': 90}, 'Fire': {'Earth': 90}, 'Earth': {'Metal': 90}, 'Metal': {'Water': 90}, 'Water': {'Wood': 90} };
  if (bazi1.element === bazi2.element) return 75;
  return scores[bazi1.element]?.[bazi2.element] || 60;
};

const calculateVedicCompatibility = (v1, v2) => {
  if (!v1 || !v2) return 50;
  const score = 100 - Math.abs(v1.nerveForce - v2.nerveForce);
  return Math.max(50, Math.min(100, score));
};

const calculateEnneagramCompatibility = (e1, e2) => {
   if (!e1 || !e2) return 50;
   // Simplified: random compatibility for demo if pairing logic complex
   return 70 + Math.floor(Math.random() * 25);
};

const calculateTarotCompatibility = (t1, t2) => {
  if (!t1 || !t2) return 50;
  return 75 + Math.floor(Math.random() * 20);
};

const calculateGreekGearCompatibility = (g1, g2) => {
  if (!g1 || !g2) return 50;
  return g1.gear === g2.gear ? 60 : 85; // Different gears mesh better
};

const calculateNumerologyCompatibility = (n1, n2) => {
  if (!n1 || !n2) return 50;
  const diff = Math.abs(n1.lifePath - n2.lifePath);
  return diff <= 1 ? 90 : 100 - (diff * 5);
};

const calculateHumanDesignCompatibility = (h1, h2) => {
  if (!h1 || !h2) return 50;
  const pairs = { 'Generator': 'Projector', 'Manifestor': 'Reflector' };
  if (pairs[h1.type] === h2.type || pairs[h2.type] === h1.type) return 95;
  return 70;
};

const generateCompatibilityNarrative = (score) => {
  if (score >= 85) return "Exceptional Match! Your cosmic blueprints align across multiple dimensions, suggesting profound potential for a transformative union.";
  if (score >= 70) return "Strong Compatibility. You share significant resonance in key areas, providing a solid foundation for growth and connection.";
  if (score >= 50) return "Moderate Harmony. While there are cosmic differences, these friction points can serve as powerful catalysts for mutual learning.";
  return "Challenging Alignment. This connection offers deep karmic lessons through overcoming significant energetic differences.";
};
