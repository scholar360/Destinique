import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cpysowyucsepvxnsgucw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNweXNvd3l1Y3NlcHZ4bnNndWN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NjQ0MzEsImV4cCI6MjA4MzU0MDQzMX0.ENsInAVQtFF4Uc2C1WwQDZKrttxeOKNEnDUawpo7_u8';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
