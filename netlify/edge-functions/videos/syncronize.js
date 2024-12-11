import { syncronize } from "../../../lib/youtube/syncronizeService";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

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
}
