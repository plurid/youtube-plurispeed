export const data = {
    entryPoints: ['./source/index.ts'],
    bundle: true,
    outfile: 'build/index.js',
    platform: 'node',
    format: 'esm',
    target: ['node20.11'],
    packages: 'external',
};
