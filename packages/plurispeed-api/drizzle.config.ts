import { Config } from 'drizzle-kit';

import dotenv from 'dotenv';



dotenv.config({
    path: '.env',
});


export default {
    schema: './source/database/schema',
    driver: 'turso',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        authToken: process.env.DATABASE_AUTH_TOKEN!,
    },
    out: './drizzle',
} satisfies Config;
