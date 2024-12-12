import { reprocessamento } from "../../../lib/youtube/test";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    // const reprocessar =  await reprocessamento()
    const reprocessar =  "sem processamento"


    res.status(200).json({
        data: reprocessar,
    });
} catch (error) {
  res
    .status(500)
    .json({ error: `Erro ao sincronizar vídeos. ${error.message}` });
}
}