/*
  File: /pages/api/google-docs/index.js
  Description: API endpoint to consume Google Docs integration. Este endpoint será consumido pelo componente de vídeo.
*/

import { getOrCreateFolder, getOrCreateDoc } from '../../../lib/google/googleDocs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} não permitido. Use POST.` });
  }

  try {
    const { videoId } = req.body;
    if (!videoId) {
      return res.status(400).json({ error: 'O parâmetro videoId é obrigatório.' });
    }

    // Obtém ou cria a pasta "NarrativaManager" no Drive.
    const folderId = await getOrCreateFolder('NarrativaManager');

    // Obtém ou cria o documento de anotação para o vídeo especificado.
    const doc = await getOrCreateDoc(videoId, folderId);

    // Retorna os dados do documento para que o frontend possa renderizá-lo em um iframe.
    return res.status(200).json({ doc });
  } catch (error) {
    console.error('Erro na integração com Google Docs:', error.message);
    return res.status(500).json({ error: `Erro interno no servidor: ${error.message}` });
  }
}