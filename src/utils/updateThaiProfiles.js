
import { supabase } from '@/lib/customSupabaseClient';
import { runDiagnostics } from './diagnostics';

const thaiNames = [
  "Araya", "Chanya", "Darika", "Kanya", "Lalana", 
  "Mali", "Nara", "Ploy", "Ratana", "Siriporn",
  "Somsri", "Sunisa", "Ubon", "Wandee", "Yue",
  "Achara", "Busarakham", "Chailai", "Dao", "Hathai",
  "Jintana", "Kulap", "Lamai", "Manee", "Niran",
  "Pen", "Pornthip", "Ratree", "Saeng", "Tida"
];

const locations = [
  "Bangkok", "Chiang Mai", "Phuket", "Krabi", "Pattaya", 
  "Rayong", "Hua Hin", "Sukhothai", "Chiang Rai", "Nakhon Ratchasima"
];

const professions = [
  "Teacher", "Graphic Designer", "Nurse", "Accountant", "Marketing Manager", 
  "Yoga Instructor", "Chef", "Photographer", "Architect", "Consultant",
  "Digital Nomad", "Business Owner", "Pharmacist", "Translator", "Interior Designer"
];

const images = [
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/eb653f1a2caa93194c9f7ac068e274f2.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/a5adb21b6d2d3ca130ce3633239ee9f2.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/9a73cb39f70acc8d126c43880782b2b1.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/7a4cfc0f4fa23b297bf37046f79236d7.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/dde7c52bf9fd084241d49ed6a993eb83.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/610405824d480900f852cda027252a10.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/8a74ba31fa34cc38bfd157bc33704b08.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/52f7f7dc8ef160b86594cb654c5fa2c4.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/0eb64c267226939d29f7545e811d4bb4.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/1b751a5ab46c72961600047a54f277b0.jpg"
];

const elements = ["Wood", "Fire", "Earth", "Metal", "Water"];
const animals = ['Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'];

const generateProfileData = (index) => {
  const name = thaiNames[index % thaiNames.length];
  const location = locations[index % locations.length];
  const profession = professions[index % professions.length];
  const imageUrl = images[index % images.length];
  const element = elements[Math.floor(Math.random() * elements.length)];
  const age = Math.floor(Math.random() * (35 - 25 + 1)) + 25;
  const birthYear = 2026 - age;
  
  const zodiacIndex = birthYear % 12;
  const zodiacSign = animals[zodiacIndex];

  return {
    name,
    age,
    location,
    profession,
    image_url: imageUrl,
    bazi_element: element,
    zodiac_sign: zodiacSign,
    bazi_animal: zodiacSign,
    bio: `Authentic ${element} soul living in ${location}. Passionate about ${profession} and seeking cosmic connection.`,
    is_sample: true
  };
};

export const updateThaiProfiles = async () => {
  console.group("🚀 Starting Thai Profile Update Process");
  
  try {
    // 1. Diagnostics
    console.log('🔍 Checking for existing profiles...');
    const { count, error: countError, data: existingProfiles } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' }); // Select ID to have data for updates

    if (countError) {
      console.error("❌ Error fetching profiles:", countError);
      console.groupEnd();
      return { success: false, message: `DB Error: ${countError.message}` };
    }

    const existingCount = count || 0;
    console.log(`📊 Found ${existingCount} existing profiles in 'profiles' table.`);

    let resultMsg = "";
    let successCount = 0;

    // CASE A: CREATE (Seed)
    if (existingCount === 0) {
      console.log("🌱 No profiles found. Mode: SEED (Creating 30 new Thai profiles)");
      const newProfiles = [];
      
      for (let i = 0; i < 30; i++) {
        newProfiles.push(generateProfileData(i));
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert(newProfiles)
        .select();

      if (error) {
        console.error("❌ Seed failed:", error);
        throw error;
      }
      
      successCount = data.length;
      resultMsg = `Successfully CREATED ${successCount} new Thai profiles.`;
      
    } 
    // CASE B: UPDATE
    else {
      console.log(`🔄 Profiles exist. Mode: UPDATE (Refining ${existingCount} profiles)`);
      
      // Batch update logic would be ideal, but looping is safer for ensuring diverse data per row
      // Note: This only updates the first 30 if more exist, or cycles through names if fewer
      
      let updatedCount = 0;
      const profilesToUpdate = existingProfiles; // Use fetched IDs

      for (let i = 0; i < profilesToUpdate.length; i++) {
        const profileId = profilesToUpdate[i].id;
        const updates = generateProfileData(i);
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', profileId);

        if (updateError) {
          console.error(`❌ Failed to update profile ID ${profileId}:`, updateError);
        } else {
          updatedCount++;
        }
      }
      
      successCount = updatedCount;
      resultMsg = `Successfully UPDATED ${successCount} existing profiles with new Thai data.`;
    }

    console.log(`✅ Operation Complete: ${resultMsg}`);
    console.groupEnd();
    return { success: true, message: resultMsg, count: successCount };

  } catch (error) {
    console.error("❌ Update/Seed Exception:", error);
    console.groupEnd();
    return { success: false, message: `Error: ${error.message}` };
  }
};
