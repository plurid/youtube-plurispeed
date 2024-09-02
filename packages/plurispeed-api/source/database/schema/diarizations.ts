import {
    sqliteTable,
    text,
    index,
} from 'drizzle-orm/sqlite-core';



export const diarizations = sqliteTable(
    'diarizations',
    {
        id: text('id').notNull().primaryKey(),
        createdAt: text('created_at').notNull(),
        createdBy: text('created_by').notNull(),
        url: text('url').notNull(),
        data: text('data').notNull(),
        status: text('status').notNull(),
        flags: text('flags').notNull(),
    },
    (diarizations) => ({
        urlIdx: index('urlIdx').on(diarizations.url),
    }),
);


export type Diarization = typeof diarizations.$inferSelect;
