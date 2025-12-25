import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

async function runSeed() {
  console.log('🚀 Adding Admin to Local Docker DB...');
  // ملاحظة: بما أننا في Docker، يفضل استخدام SQL Editor لإضافة البيانات 
  // ولكن إذا أردت استخدام هذا الملف، يجب أن يكون كود TypeScript وليس SQL.
}
runSeed();