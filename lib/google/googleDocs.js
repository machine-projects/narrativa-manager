/*
  File: /lib/google/googleDocs.js
  Description: Contains helper functions to interact with Google Drive and Docs APIs,
               including creating or retrieving folders and documents, and updating document content.
*/

import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/documents'
];

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: SCOPES,
});

// Initialize the Drive and Docs API clients.
export const drive = google.drive({ version: 'v3', auth });
export const docs = google.docs({ version: 'v1', auth });

/**
 * Retrieves or creates a folder with the specified name in Google Drive.
 *
 * @param {string} folderName - Name of the folder (e.g., 'NarrativaManager').
 * @returns {Promise<string>} - The ID of the folder.
 */
export async function getOrCreateFolder(folderName) {
  try {
    const res = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (res.data.files && res.data.files.length > 0) {
      return res.data.files[0].id;
    } else {
      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };

      const folder = await drive.files.create({
        resource: fileMetadata,
        fields: 'id',
      });
      return folder.data.id;
    }
  } catch (error) {
    throw new Error('Erro ao obter ou criar a pasta: ' + error.message);
  }
}

/**
 * Retrieves or creates a Google Docs document for a video annotation.
 *
 * @param {string} videoId - Identifier for the video.
 * @param {string} folderId - Google Drive folder ID where the document should reside.
 * @returns {Promise<Object>} - The document's data (id, name, webViewLink).
 */
export async function getOrCreateDoc(videoId, folderId) {
  try {
    const fileName = `Annotation_${videoId}`;
    const query = `mimeType='application/vnd.google-apps.document' and name='${fileName}' and '${folderId}' in parents and trashed=false`;
    const res = await drive.files.list({
      q: query,
      fields: 'files(id, name, webViewLink)',
    });

    if (res.data.files && res.data.files.length > 0) {
      return res.data.files[0];
    } else {
      const fileMetadata = {
        name: fileName,
        mimeType: 'application/vnd.google-apps.document',
        parents: [folderId],
      };

      const createdDoc = await drive.files.create({
        resource: fileMetadata,
        fields: 'id, name, webViewLink',
      });
      return createdDoc.data;
    }
  } catch (error) {
    throw new Error('Erro ao obter ou criar o documento: ' + error.message);
  }
}

/**
 * Edits a Google Docs document using batchUpdate requests.
 *
 * @param {string} docId - The ID of the document to be edited.
 * @param {Array<Object>} requests - An array of request objects for the batchUpdate.
 * @returns {Promise<Object>} - The response from the Docs API.
 */
export async function updateDocContent(docId, requests) {
  try {
    const response = await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {
        requests,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar o documento: ' + error.message);
  }
}