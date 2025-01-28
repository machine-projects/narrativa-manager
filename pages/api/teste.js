const ytdl = require('ytdl-core');

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      res.status(200).json({
        message: 'API de vídeos operacional.',
      });
    } else if (req.method === 'POST') {
      // Adicionar um novo vídeo
      const { videoUrl } = req.body;

      if (!videoUrl) {
        return res
          .status(400)
          .json({ error: 'O campo "videoUrl" é obrigatório.' });
      }

      try {
        // Obter informações do vídeo
        const info = await ytdl.getInfo(videoUrl);

        // Selecionar o formato desejado (exemplo: mp4 com maior qualidade)
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });

        // Retornar o link para download
        res.status(200).json({
          message: 'Link obtido com sucesso.',
          downloadLink: format.url,
          title: info.videoDetails.title,
          description: info.videoDetails.shortDescription,
          author: info.videoDetails.author.name,
        });
      } catch (error) {
        console.error('Erro ao obter o link:', error.message);
        res.status(500).json({ error: `Erro ao obter o link do vídeo: ${error.message}` });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Método ${req.method} não permitido.` });
    }
  } catch (error) {
    console.error('Erro no handler de vídeos:', error.message);
    res.status(500).json({ error: `Erro interno do servidor. ${error.message}` });
  }
}
