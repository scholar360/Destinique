
import { calculateBazi, calculateNumerology } from './assessmentCalculator';

// Helper to get Zodiac Sign from date
const getZodiacSign = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  return "Unknown";
};

// Map Zodiac signs to element groups for scoring
const zodiacElements = {
  Fire: ["Aries", "Leo", "Sagittarius"],
  Earth: ["Taurus", "Virgo", "Capricorn"],
  Air: ["Gemini", "Libra", "Aquarius"],
  Water: ["Cancer", "Scorpio", "Pisces"]
};

export const calculateCosmicScores = (birthDate, name = "Cosmic Traveler") => {
  if (!birthDate) return null;

  // 1. Base Calculations
  const bazi = calculateBazi(birthDate); // Returns { element, animal, ... }
  const numerology = calculateNumerology(birthDate, name); // Returns { lifePath, destiny ... }
  const zodiacSign = getZodiacSign(birthDate);

  // 2. Psychological Dimension Score Calculation
  // Logic: Focuses on 'Self' strength, expression, and inner drive.
  // Fire/Air signs + Odd Life Paths tend to be more outwardly expressive (higher psych score in this specific model)
  // Water/Earth + Even Life Paths might be more introspective (balanced score)
  
  let psychScore = 50; // Base
  
  // Zodiac Impact
  if (zodiacElements.Fire.includes(zodiacSign)) psychScore += 20;
  if (zodiacElements.Air.includes(zodiacSign)) psychScore += 15;
  if (zodiacElements.Water.includes(zodiacSign)) psychScore += 10;
  if (zodiacElements.Earth.includes(zodiacSign)) psychScore += 5;

  // BaZi Impact (Element)
  if (["Fire", "Wood"].includes(bazi.element)) psychScore += 15;
  if (["Metal", "Water"].includes(bazi.element)) psychScore += 10;
  if (bazi.element === "Earth") psychScore += 5;

  // Numerology Impact (Life Path - Odd numbers often seen as more dynamic/individualistic)
  if (numerology.lifePath % 2 !== 0) psychScore += 10;
  else psychScore += 5;

  // Clamp Score 0-100
  const psychologicalScore = Math.min(100, Math.max(0, psychScore));


  // 3. Systemic Dimension Score Calculation
  // Logic: Focuses on 'Harmony', structural alignment, and adaptability.
  // Earth/Water signs + Even Life Paths tend to be more stable/adaptive (higher systemic score)
  
  let sysScore = 50; // Base

  // Zodiac Impact
  if (zodiacElements.Earth.includes(zodiacSign)) sysScore += 20;
  if (zodiacElements.Water.includes(zodiacSign)) sysScore += 15;
  if (zodiacElements.Air.includes(zodiacSign)) sysScore += 10;
  if (zodiacElements.Fire.includes(zodiacSign)) sysScore += 5;

  // BaZi Impact
  if (["Earth", "Metal"].includes(bazi.element)) sysScore += 15;
  if (["Water", "Wood"].includes(bazi.element)) sysScore += 10;
  if (bazi.element === "Fire") sysScore += 5;

  // Numerology Impact (Master numbers or stable even numbers)
  if ([11, 22, 33].includes(numerology.lifePath)) sysScore += 20; // Master numbers usually imply high systemic awareness
  else if (numerology.lifePath % 2 === 0) sysScore += 10;
  else sysScore += 5;

  // Clamp Score 0-100
  const systemicScore = Math.min(100, Math.max(0, sysScore));

  return {
    psychologicalScore,
    systemicScore,
    breakdown: {
      baziElement: bazi.element,
      baziAnimal: bazi.animal,
      zodiacSign: zodiacSign,
      lifePathNumber: numerology.lifePath
    }
  };
};
