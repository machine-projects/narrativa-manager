import clientPromise from "../../../lib/mongodb";
import VideosRepository from "../../../lib/youtube/videoRepository";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const videosRepository = new VideosRepository(client);

    if (req.method === "GET") {
      // Paginado ou todos os vídeos
      const { page = 1, limit = 10, all = false } = req.query;

      if (all === "true") {
        const videos = await videosRepository.getAllVideos();
        return res.status(200).json({ total: videos.length, data: videos });
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await videosRepository.countVideos();
      const videos = await videosRepository.getPaginatedVideos(skip, Number(limit));

      res.status(200).json({
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        data: videos,
      });
    } else if (req.method === "POST") {
      // Adicionar um novo vídeo
      const { title, channelId, description, url, publishedAt } = req.body;

      if (!title || !channelId || !url || !publishedAt) {
        return res.status(400).json({ error: "Campos obrigatórios estão ausentes." });
      }

      const newVideo = {
        title,
        channelId,
        description: description || "",
        url,
        publishedAt: new Date(publishedAt),
        createdAt: new Date(),
      };

      const result = await videosRepository.insertVideo(newVideo);

      res.status(201).json({
        message: "Vídeo adicionado com sucesso.",
        video: { id: result.insertedId, ...newVideo },
      });
    } else if (req.method === "PUT") {
      // Atualizar um vídeo por ID
      const { id, ...updateData } = req.body;

      if (!id) {
        return res.status(400).json({ error: "O ID do vídeo é obrigatório." });
      }

      const result = await videosRepository.collection.updateOne(
        { _id: id },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Vídeo não encontrado." });
      }

      res.status(200).json({ message: "Vídeo atualizado com sucesso." });
    } else if (req.method === "DELETE") {
      // Remover um vídeo por ID
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "O ID do vídeo é obrigatório." });
      }

      const result = await videosRepository.collection.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Vídeo não encontrado." });
      }

      res.status(200).json({ message: "Vídeo removido com sucesso." });
    } else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).json({ error: `Método ${req.method} não permitido.` });
    }
  } catch (error) {
    console.error("Erro no handler de vídeos:", error.message);
    res.status(500).json({ error: `Erro interno do servidor. ${error.message}` });
  }
}
