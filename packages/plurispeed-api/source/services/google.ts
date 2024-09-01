import {
    OAuth2Client,
} from 'google-auth-library';



const newOAuth2Client = () => new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage',
);


export default newOAuth2Client;
