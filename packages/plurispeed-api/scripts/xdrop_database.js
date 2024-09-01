import { createClient } from '@libsql/client';

import dotenv from 'dotenv';



dotenv.config({
    path: '.env',
});


const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
});


const DROPS = [
    `DROP TABLE IF EXISTS users;`,
    `DROP TABLE IF EXISTS diarizations;`,
]


for (const drop of DROPS) {
    await client.execute(drop);
}
