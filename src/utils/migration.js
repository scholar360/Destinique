
import { supabase } from '@/lib/customSupabaseClient';

// Authentic Chinese Surnames
const surnames = [
  "王", "李", "张", "刘", "陈", "杨", "黄", "周", "徐", "孙", 
  "马", "朱", "林", "何", "高", "郑", "罗", "梁", "宋", "唐"
];

// Authentic Chinese Given Name Characters (Female)
const femaleGivenChars = [
  "芳", "娜", "丽", "美", "静", "红", "英", "琴", "敏", "娟", 
  "琳", "燕", "雪", "玲", "梅", "芬", "莉", "晓", "欣", "雨", 
  "佳", "思", "颖", "丹", "萍", "露", "瑶", "怡", "婵", "雁", 
  "蓓", "薇", "菁", "岚", "苑", "婕", "馨", "瑗", "琰", "韵"
];

const locations = [
  "Beijing", "Shanghai", "Guangzhou", "Chengdu", "Hangzhou", "Nanjing", "Wuhan", 
  "Xi'an", "Suzhou", "Shenzhen", "Chongqing", "Tianjin", "Dongguan", "Foshan"
];

const professions = [
  "Software Engineer", "Marketing Manager", "Teacher", "Nurse", "Financial Analyst", 
  "Data Scientist", "Accountant", "Graphic Designer", "Product Manager", "Sales Manager", 
  "Chef", "Doctor", "Lawyer", "Architect", "Researcher", "HR Manager", "Consultant", "Entrepreneur"
];

const interestsList = [
  "Travel", "Cooking", "Yoga", "Photography", "Reading", "Hiking", 
  "Music", "Movies", "Art", "Badminton", "Foodie", "Meditation", 
  "Technology", "Investing", "Fashion", "Volunteering"
];

const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const baziElements = ["Wood", "Fire", "Earth", "Metal", "Water"];
const baziAnimals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];

// Provided authentic female images
const femalePhotos = [
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/17725b5942a587e70643d02909914ac3.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/420481715edd714db6b743a5582288a4.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/9684081cb6d93012100db7524da6f13a.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/58c6d15369f2172d89eeb1c0f85cc83c.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/d708a62022e53b2431001454e35ba54b.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/59556aa50e5b51f7cc4d17244849c111.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/592faa0c742040a17347f226dd168d84.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/b2d1ec89482119fcba24133c22960f2c.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/9ed4677718c9a9787af16ad85c3dce85.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/fbd3acce86a3474aadd698608e333d3b.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/9dcf5bcd099866ccbbac3eb244873e82.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/e812e8585a25c5d5bc24ab3190637f37.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/cfb71a38a663108a77e71ac02c9b0e93.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/a82ebdc1dfe62fa07fe9666adf9ec086.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/eb05e441275bafa6b4a720ec333c069c.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/e19e885c9a9fd7978234001feb54cf89.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/d7e2966992bbc022dc75365e9b56f26c.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/274065d0f08781f160231a1446dfbc08.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/efe4b7fb6d0e8684492945abf0c42889.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/982eb48f84befad19ff3ce2527c27cd5.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/42d6fc5853e948600655a71db0ba2a25.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/785e71486c2f6279be6321c03a34682e.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/c585333df2899e9838ac25ff6d344601.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/5efc605d6bda3ca957d91d5d44905b63.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/625747e1f8d8f6c5263daac3b992fd32.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/a736a10d63ea8b7ee29a7c6f80a64ede.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/905496549b692018a7b52523f7ad7262.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/da3168a40681449daf1bd5aade624d8f.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/e3f6fa59cda3190cf886988eba141d30.jpg",
  "https://horizons-cdn.hostinger.com/1173db3f-71f5-45bc-88cb-06dcb867f2c6/ac3418cc92409965d562d1ae42e78802.jpg",
];

const generateName = () => {
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const givenChars = femaleGivenChars;
  const nameLength = Math.random() > 0.3 ? 1 : 2; 
  let givenName = "";
  for(let i = 0; i < nameLength; i++) {
    givenName += givenChars[Math.floor(Math.random() * givenChars.length)];
  }
  return surname + givenName;
};

export const runMigration = async () => {
  console.group('🚀 Starting Migration Process');
  try {
    // 1. Diagnostic: Check DB Connection and Initial Count
    console.log('🔍 Diagnostic: Testing Supabase connection...');
    const { count: startCount, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Connection failed or table "profiles" not found:', countError);
      console.groupEnd();
      return { success: false, error: countError, message: "DB Connection failed" };
    }
    console.log(`✅ Connection successful. Current profile count: ${startCount}`);

    // 2. Generate Data
    console.log('⚡ Generating 30 authentic profiles...');
    const profiles = [];
    for (let i = 0; i < 30; i++) {
      let name = generateName();
      let photoUrl = femalePhotos[i % femalePhotos.length];

      const numInterests = Math.floor(Math.random() * 3) + 3;
      const shuffledInterests = [...interestsList].sort(() => 0.5 - Math.random());
      const interests = shuffledInterests.slice(0, numInterests);

      const zodiacSign = zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)];
      const baziElement = baziElements[Math.floor(Math.random() * baziElements.length)];
      const baziAnimal = baziAnimals[Math.floor(Math.random() * baziAnimals.length)];
      const profession = professions[Math.floor(Math.random() * professions.length)];

      profiles.push({
        name: name,
        age: Math.floor(Math.random() * (38 - 26 + 1)) + 26,
        location: locations[Math.floor(Math.random() * locations.length)],
        profession: profession,
        image_url: photoUrl,
        zodiac_sign: zodiacSign,
        bazi_element: baziElement,
        bazi_animal: baziAnimal,
        bio: "Seeking a meaningful connection with a like-minded soul.",
        interests: interests,
        is_sample: true
      });
    }

    console.log(`📋 Prepared ${profiles.length} profiles for insertion.`);
    console.log('📋 Sample profile structure:', profiles[0]);

    // 3. Insert Data
    console.log(`📤 Inserting ${profiles.length} profiles into 'profiles' table...`);
    const { data, error } = await supabase.from('profiles').insert(profiles).select();

    if (error) {
      console.error('❌ Insert failed:', error);
      console.groupEnd();
      return { success: false, error, message: `Insert failed: ${error.message}` };
    }

    const insertedCount = data ? data.length : 0;
    
    // 4. Final Verification
    const { count: endCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    console.log(`✅ Successfully inserted ${insertedCount} profiles.`);
    console.log(`📊 Profile count updated from ${startCount} to ${endCount}`);
    
    console.groupEnd();
    return { 
      success: true, 
      count: insertedCount, 
      message: `Successfully inserted ${insertedCount} profiles. Total: ${endCount}` 
    };

  } catch (err) {
    console.error('❌ Unexpected Migration Exception:', err);
    console.groupEnd();
    return { success: false, error: err, message: `Exception: ${err.message}` };
  }
};
