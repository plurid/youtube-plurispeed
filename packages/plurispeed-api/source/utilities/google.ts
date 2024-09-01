import {
    drive_v3,
} from 'googleapis';

import {
    logger,
} from './index';



export async function createFolder(
    googleDrive: drive_v3.Drive,
    name: string,
) {
    const fileMetadata = {
        name,
        mimeType: 'application/vnd.google-apps.folder',
    };

    try {
        const file = await googleDrive.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });
        console.log('Folder Id:', file.data.id);

        return file.data.id || '';
    } catch (error) {
        logger('warn', error);
    }
}

export async function searchFolder(
    googleDrive: drive_v3.Drive,
    name: string,
) {
    try {
        const res = await googleDrive.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and name='${name}' and trashed=false`,
            fields: 'files(id)',
            spaces: 'drive',
        });

        if (!res.data.files) {
            return;
        }

        return res.data.files[0].id;
    } catch (error) {
        logger('warn', error);
    }
}

export async function searchFile(
    googleDrive: drive_v3.Drive,
    name: string,
) {
    try {
        const res = await googleDrive.files.list({
            q: `name='${name}' and trashed=false`,
            fields: 'files(id)',
            spaces: 'drive',
        });

        if (!res.data.files) {
            return;
        }

        return res.data.files[0].id;
    } catch (error) {
        logger('warn', error);
    }
}
