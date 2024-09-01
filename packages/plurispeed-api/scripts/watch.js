import {
    context,
} from 'esbuild';

import {
    data,
} from './data.js';



const onEndPlugin = {
    name: 'on-end',
    setup(build) {
        build.onEnd((result) => {
            console.log(`build ended with ${result.errors.length} errors`);
        });
    },
};

const run = await context({
    ...data,
    plugins: [onEndPlugin],
});

await run.watch();
