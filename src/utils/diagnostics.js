
import { supabase } from '@/lib/customSupabaseClient';

/**
 * Diagnostic utility to inspect the profiles table.
 * Logs detailed information to the console for debugging purposes.
 */
export const runDiagnostics = async () => {
  console.group('🔍 Database Diagnostics');
  
  try {
    // 1. Check Total Count
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error fetching count:', countError);
      console.groupEnd();
      return { success: false, error: countError };
    }
    
    console.log(`📊 Total Profiles in DB: ${count}`);

    // 2. Check Sample Profiles
    const { data: samples, error: sampleError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (sampleError) {
      console.error('❌ Error fetching samples:', sampleError);
      console.groupEnd();
      return { success: false, error: sampleError };
    }

    if (!samples || samples.length === 0) {
      console.warn('⚠️ No profiles found in the database.');
    } else {
      console.log('📋 First 5 Profiles Snapshot:', samples);
      
      // 3. Analyze Data Integrity
      let missingImages = 0;
      let missingFields = 0;
      
      samples.forEach(p => {
        if (!p.image_url) missingImages++;
        if (!p.name || !p.age || !p.location) missingFields++;
      });

      if (missingImages > 0) console.warn(`⚠️ ${missingImages} profiles in snapshot are missing images.`);
      if (missingFields > 0) console.warn(`⚠️ ${missingFields} profiles in snapshot are missing basic fields.`);
      if (missingImages === 0 && missingFields === 0) console.log('✅ Data integrity check passed for snapshot (Images & Basic Fields present).');
    }

    console.groupEnd();
    return { success: true, count, samples };

  } catch (err) {
    console.error('❌ Unexpected Diagnostic Error:', err);
    console.groupEnd();
    return { success: false, error: err };
  }
};
