import { syncronize, getSyncronize } from "../../../lib/youtube/syncronizeService";

export default async function handler(req, res) {
  if (req.method == "POST") {


    try {

      const {
        channels_ids,
        num_syncronize,
        startDate = null,
        endDate = null,
      } = req.body;

      const result = await syncronize(
        channels_ids,
        num_syncronize,
        startDate,
        endDate
      );
      const num_results = result?.insertedCount ? result?.insertedCount : 0
      res.status(200).json({
        data: result,
        message: `Sincronização concluida, ${num_results} itens foram atualizados!`,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: `Erro ao sincronizar vídeos. ${error.message}` });
    }
  } else if (req.method === "GET") {
    try {
      const {
        page = 1,
        limit = 10,
        channel_id,
        language,
        targetLanguage,
        type_platforms,
        isFamilySafe,
        targets,
        createdAfter,
        createdBefore,
        videos_id,
      } = req.query;

      const filters = {
        channel_id,
        language,
        targetLanguage,
        type_platforms,
        isFamilySafe: isFamilySafe === "true", // Converte para booleano
        targets,
        createdAfter,
        createdBefore,
        videos_id,
      };

      const result = await getSyncronize(parseInt(page), parseInt(limit), filters);

      res.status(200).json(result);
    } catch (error) {
      res
        .status(500)
        .json({ error: `Erro ao buscar dados sincronizados. ${error.message}` });
    }
  } else {
    res.status(405).json({ error: "Método não permitido." });
  }
}
