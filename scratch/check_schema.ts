
import { supabaseServer } from "../src/lib/supabase-server";

async function checkSchema() {
  try {
    const { data, error } = await supabaseServer
      .from('order_items')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error("Error fetching order_items:", error);
    } else {
      console.log("order_items data sample:", data);
    }
  } catch (err) {
    console.error("Exception:", err);
  }
}

checkSchema();
