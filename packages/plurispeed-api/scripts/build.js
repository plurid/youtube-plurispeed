import {
    build,
} from 'esbuild';

import {
    data,
} from './data.js';



await build({
    ...data,
});
