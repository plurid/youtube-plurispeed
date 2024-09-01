import { createClient } from '@libsql/client';

import dotenv from 'dotenv';



dotenv.config({
    path: '.env',
});


const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
});


const tables = [
`CREATE TABLE IF NOT EXISTS users (
    id TEXT NOT NULL PRIMARY KEY,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    picture TEXT NOT NULL,
    payments TEXT NOT NULL
);`,
`CREATE UNIQUE INDEX IF NOT EXISTS emailIdx ON users (email);`,

`CREATE TABLE IF NOT EXISTS diarizations (
    id TEXT NOT NULL PRIMARY KEY,
    created_at TEXT NOT NULL,
    created_by TEXT NOT NULL,
    url TEXT NOT NULL,
    data TEXT NOT NULL
);`,
`CREATE INDEX IF NOT EXISTS urlIdx ON diarizations (url);`,
];


for (const table of tables) {
    const tableName = table.match(/CREATE (?:VIRTUAL )?TABLE IF NOT EXISTS (\w+)/);
    if (tableName) {
        console.log('Creating table', tableName[1]);
    } else {
        const index = table.match(/CREATE (?:UNIQUE )?INDEX IF NOT EXISTS (\w+)/);
        if (index) {
            console.log('Creating index', index[1]);
        }
    }

    await client.execute(table.trim());
}
