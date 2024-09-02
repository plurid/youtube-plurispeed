import express from 'express';
import cookieParser from 'cookie-parser';

import {
    getUser,
    logout,
    googleLogin,
    checkoutSessions,

    getDiarization,
    createDiarization,
    requestDiarization,
} from './handlers';



const port = process.env.PORT || 8080;
const app = express();


const main = async () => {
    app.use(express.json({
        limit: '5mb',
    }));
    app.use(cookieParser());

    app.all('*', (req, res, next) => {
        const origin = req.get('origin');

        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');

        next();
    });

    app.post('/get-user', getUser);
    app.post('/logout', logout);
    app.post('/google-login', googleLogin);
    app.post('/stripe-checkout-sessions', checkoutSessions);

    app.post('/get-diarization', getDiarization);
    app.post('/create-diarization', createDiarization);
    app.post('/request-diarization', requestDiarization);

    app.listen(port, () => {
        console.log(`Server started on ${port}`);
    });
}


main();
