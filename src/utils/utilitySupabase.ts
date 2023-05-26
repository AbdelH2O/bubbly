import { createClient } from '@supabase/supabase-js';
import { type Database } from 'lib/database';
import { env } from '~/env.mjs';

const uSBClient = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
);

export default uSBClient;