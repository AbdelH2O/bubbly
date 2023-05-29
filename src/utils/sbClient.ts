import { createClient } from "@supabase/supabase-js";
import { env } from "~/env.mjs";
import { useSession } from "next-auth/react";
import type { Database } from "lib/database";
// import { log } from "console";

const useToken = () => {
    const session = useSession();
    if (!session) return undefined;
    if (session.status !== "authenticated") return undefined;
    const { supabaseAccessToken } = session.data;
    return supabaseAccessToken;
};

const useCLient = () => {
    const supabaseAccessToken = useToken();
    // console.log(supabaseAccessToken);

    const supabase = createClient<Database>(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${supabaseAccessToken || ""}`,
                },
            },
        }
    );
    return supabase;
};

export default useCLient;