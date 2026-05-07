import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'hero_banners' });
  
  if (error) {
    // Fallback: try to select one row
    const { data: row, error: selectError } = await supabase.from('hero_banners').select('*').limit(1);
    if (selectError) {
      console.error('Error fetching table info:', selectError);
    } else {
      console.log('Columns found in a row:', Object.keys(row[0] || {}));
    }
  } else {
    console.log('Table columns:', data);
  }
}

inspectTable();
