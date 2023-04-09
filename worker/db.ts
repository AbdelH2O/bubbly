import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { type Database } from "lib/database.types";

// import { env } from "./env.mjs";
const env = { NODE_ENV: "development" };

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log:
            env.NODE_ENV === "development"
                ? ["query", "error", "warn"]
                : ["error"],
    });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
// console.log(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

