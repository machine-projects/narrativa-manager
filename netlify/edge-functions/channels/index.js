import clientPromise from "@/lib/mongodb";
import {
  getChannelIdFromCustomUrl,
  getChannelDetails,
} from "@/lib/youtube/channelServices";
import ChannelRepository from "../../../lib/youtube/channelRepository";

import {
  translateToPortuguese,
  targetLanguageToPortuguese,
} from "@/lib/translate";
import { syncronize } from "@/lib/youtube/syncronizeService";


export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const channelRepository = new ChannelRepository(client);

    if (req.method === "POST") {
      const {
        custom_name_channel,
        targetLanguage,
        type_platforms,
        adm_channel_id,
        targets = [],
      } = req.body;

      if (
        !custom_name_channel ||
        !targetLanguage ||
        !type_platforms ||
        !adm_channel_id
      ) {
        return res
          .status(400)
          .json({ error: "Todos os campos são obrigatórios." });
      }

      const channelId = await getChannelIdFromCustomUrl(
        custom_name_channel.trim()
      );
      if (!channelId) {
        return res.status(404).json({ error: "Canal não encontrado." });
      }

      const channelDetails = await getChannelDetails(channelId);
      if (!channelDetails) {
        return res
          .status(404)
          .json({ error: "Não foi possível obter detalhes do canal." });
      }

      const existingChannel = await channelRepository.getbyChannelId(channelId);
      if (existingChannel) {
        return res.status(409).json({ error: "Canal já está cadastrado." });
      }

      const language = targetLanguageToPortuguese(targetLanguage);
      const channel_name_presentation = await translateToPortuguese(
        targetLanguage,
        channelDetails.title
      );
      const description = channelDetails.description
        ? await translateToPortuguese(
            targetLanguage,
            channelDetails.description
          )
        : "";

      const newChannel = {
        channel_name_presentation,
        channel_name: channelDetails.title,
        custom_name_channel,
        channelId,
        language,
        targetLanguage,
        type_platforms,
        adm_channel_id,
        description,
        image: channelDetails.image || "",
        applied_videos: 0,
        createdAt: new Date(),
        targets,
      };

      const result = await channelRepository.insertChannel(newChannel);
      
      const getSyncronize = await syncronize([channelId], 100, null, null);
      const num_syncronize = getSyncronize?.insertedCount ? getSyncronize.insertedCount : 0 
      res.status(201).json({
        message: `Canal cadastrado com sucesso e sincronizado ${num_syncronize} itens`,
        channel: { id: result.insertedId, ...newChannel },
        num_syncronize
      });
    } else if (req.method === "GET") {
      const {
        page = 1,
        limit = 10,
        all = false,
        channel_name_presentation = null,
        channel_name = null,
        custom_name_channel = null,
        channelId = null,
        language = null,
        targetLanguage = null,
        type_platforms,
        adm_channel_id,
        description,
        applied_videos = null,
        createdAt = null,
        targets = null,
        channelsIds = null,
      } = req.query;

      if (all === "true") {
        const videos = await channelRepository.getAllVideos();
        return res.status(200).json({ total: videos.length, data: videos });
      }
      if (channelId) {
        const video = await channelRepository.getbyChannelId(channelId);
        return res.status(200).json({ data: video });
      }
      if (custom_name_channel) {
        const video = await channelRepository.getbyCustomName(
          custom_name_channel
        );
        return res.status(200).json({ data: video });
      }
      // Construção dinâmica de filtros para consulta paginada
      const filters = {};
      if (channel_name_presentation)
        filters.channel_name_presentation = channel_name_presentation;
      if (channel_name) filters.channel_name = channel_name;
      if (custom_name_channel)
        filters.custom_name_channel = custom_name_channel;
      if (channelId) filters.channelId = channelId;
      if (language) filters.language = language;
      if (targetLanguage) filters.targetLanguage = targetLanguage;
      if (type_platforms) filters.type_platforms = type_platforms.split(",");
      if (adm_channel_id) filters.adm_channel_id = adm_channel_id;
      if (applied_videos) filters.applied_videos = Number(applied_videos);
      if (createdAt) filters.createdAt = createdAt;
      if (targets) filters.targets = targets.split(",");
      if (channelsIds) filters.channelsIds = channelsIds.split(",");
      const skip = (Number(page) - 1) * Number(limit);
      const total = await channelRepository.countChannels();
      const channels = await channelRepository.getPaginatedChannels(
        skip,
        Number(limit),
        filters
      );

      res.status(200).json({
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        data: channels,
      });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ error: `Método ${req.method} não permitido.` });
    }
  } catch (error) {
    console.error("Erro no handler:", error.message);
    res
      .status(500)
      .json({ error: `Erro interno do servidor. ${error.message}` });
  }
}
