import { createClient } from '@supabase/supabase-js';
import { Database } from 'lib/database.types';
import { env } from '~/env.mjs';

const uSBClient = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
);

export default uSBClient;