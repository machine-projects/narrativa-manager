
const { ObjectId } = require('mongodb');

export default class ChannelRepository {
  constructor(client) {
    this.db = client.db("projetoia");
    this.collection = this.db.collection("channel");
  }

  /**
   * Conta o número total de documentos na coleção.
   * @returns {Promise<number>}
   */
  async countChannels(filters = {}) {
    // Constrói o filtro com base nos critérios fornecidos
    const query = {};
    if (filters.channel_name_presentation) {
      query.channel_name_presentation = { $regex: filters.channel_name_presentation, $options: "i" }; // Busca parcial (case insensitive)
    }
    if (filters.channel_name) {
      query.channel_name = { $regex: filters.channel_name, $options: "i" };
    }
    if (filters.custom_name_channel) {
      query.custom_name_channel = filters.custom_name_channel;
    }
    if (filters.channelId) {
      query.channelId = filters.channelId;
    }
    if (filters.channelsIds) {
      query.channelId = { "$in": channelsIds };
    }
    if (filters.language) {
      query.language = filters.language;
    }
    if (filters.targetLanguage) {
      query.targetLanguage = filters.targetLanguage;
    }
    if (filters.type_platforms) {
      query.type_platforms = { $in: filters.type_platforms }; // Filtro por qualquer item na lista
    }
    if (filters.adm_channel_id) {
      query.adm_channel_id = filters.adm_channel_id;
    }
    if (filters.targets) {
      query.targets = { $in: filters.targets }; // Filtro por qualquer item na lista
    }
    if (filters.createdAt) {
      query.createdAt = { $gte: new Date(filters.createdAt) }; // Filtro por data inicial
    }
    
    return await this.collection.countDocuments();
  }

  /**
   * Obtém uma lista paginada de canais.
   * @param {number} skip - Número de documentos a ignorar.
   * @param {number} limit - Número de documentos a retornar.
   * @returns {Promise<Array>}
   */
  async getPaginatedChannels(skip, limit, filters = {}) {
    const query = {};
    if (filters.channel_name_presentation) {
      query.channel_name_presentation = { $regex: filters.channel_name_presentation, $options: "i" }; // Busca parcial (case insensitive)
    }
    if (filters.channel_name) {
      query.channel_name = { $regex: filters.channel_name, $options: "i" };
    }
    if (filters.custom_name_channel) {
      query.custom_name_channel = filters.custom_name_channel;
    }
    if (filters.channelId) {
      query.channelId = filters.channelId;
    }
    if (filters.channelsIds) {
      query.channelId = { "$in": channelsIds };
    }
    if (filters.language) {
      query.language = filters.language;
    }
    if (filters.targetLanguage) {
      query.targetLanguage = filters.targetLanguage;
    }
    if (filters.type_platforms) {
      query.type_platforms = { $in: filters.type_platforms }; // Filtro por qualquer item na lista
    }
    if (filters.adm_channel_id) {
      query.adm_channel_id = filters.adm_channel_id;
    }
    if (filters.targets) {
      query.targets = { $in: filters.targets }; // Filtro por qualquer item na lista
    }
    if (filters.createdAt) {
      query.createdAt = { $gte: new Date(filters.createdAt) }; // Filtro por data inicial
    }
    return await this.collection.find({}).skip(skip).limit(limit).toArray();
  }

  /**
   * Obtém todos os canais.
   * @returns {Promise<Array>}
   */
  async getAllChannels(filters = {}) {
    // Constrói o filtro com base nos critérios fornecidos
    const query = {};
    if (filters.channel_name_presentation) {
      query.channel_name_presentation = { $regex: filters.channel_name_presentation, $options: "i" }; // Busca parcial (case insensitive)
    }
    if (filters.channel_name) {
      query.channel_name = { $regex: filters.channel_name, $options: "i" };
    }
    if (filters.custom_name_channel) {
      query.custom_name_channel = filters.custom_name_channel;
    }
    if (filters.channelId) {
      query.channelId = filters.channelId;
    }
    if (filters.channels_ids) {
      query.channelId = { "$in": filters.channels_ids };
    }
    if (filters.language) {
      query.language = filters.language;
    }
    if (filters.targetLanguage) {
      query.targetLanguage = filters.targetLanguage;
    }
    if (filters.type_platforms) {
      query.type_platforms = { $in: filters.type_platforms }; // Filtro por qualquer item na lista
    }
    if (filters.adm_channel_id) {
      query.adm_channel_id = filters.adm_channel_id;
    }
    if (filters.targets) {
      query.targets = { $in: filters.targets }; // Filtro por qualquer item na lista
    }
    if (filters.createdAt) {
      query.createdAt = { $gte: new Date(filters.createdAt) }; // Filtro por data inicial
    }

    return await this.collection.find(query).toArray();
  }

  /**
   * Obtém um canal por Channel ID.
   * @param {string} channelId
   * @returns {Promise<Object>}
   */
  async getbyChannelId(channelId) {
    return await this.collection.findOne({ channelId });
  }
  /**
   * Obtém um canal por Channel ID.
   * @param {string} custom_name_channel
   * @returns {Promise<Object>}
   */
  async getbyCustomName(custom_name_channel) {
    return await this.collection.findOne({ custom_name_channel:custom_name_channel });
  }

  /**
   * Insere um novo canal.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async insertChannel(data) {
    return await this.collection.insertOne(data);
  }
  

/**
 * Incrementa o campo applied_videos em +1 para um canal específico.
 * @param {string} channelId - O ID do canal.
 * @returns {Promise<Object>} - Resultado da operação de atualização.
 */
async incrementAppliedVideos(channelId) {
  if (!channelId) {
      throw new Error("O ID do canal é obrigatório.");
  }

  try {
      const result = await this.collection.updateOne(
          { channelId },
          { $inc: { applied_videos: 1 } }
      );

      if (result.matchedCount === 0) {
          throw new Error("Canal não encontrado.");
      }

      return result;
  } catch (error) {
      console.error("Erro ao incrementar applied_videos no canal:", error.message);
      throw error;
  }
}


/**
 * Atualiza um canal e todas as referências associadas nos vídeos.
 * @param {Object} channelUpdates - Os campos a serem atualizados no canal, incluindo o `_id`.
 * @returns {Promise<Object>} - Resultado da operação de atualização.
 */
async updateChannelAndVideos(channelUpdates) {
    if (!channelUpdates || typeof channelUpdates !== "object" || !channelUpdates._id) {
        throw new Error("Os dados de atualização são obrigatórios e devem conter um '_id' válido.");
    }

    try {
        
        const channelId =  new ObjectId(channelUpdates._id);

        
        const { _id, ...updates } = channelUpdates;

        
        const channelUpdateResult = await this.collection.updateOne(
            { _id: channelId },
            { $set: updates }
        );

        if (channelUpdateResult.matchedCount === 0) {
            throw new Error("Canal não encontrado.");
        }

        console.log(`Canal com ID ${channelId} atualizado com sucesso.`);

        
        const videosCollection = this.db.collection("video");
        const videosUpdateResult = await videosCollection.updateMany(
          { "channel._id":  channelId },
            { $set: { channel: updates } }
        );

        console.log(`Foram atualizados ${videosUpdateResult.modifiedCount} vídeos associados ao canal.`);

        return {
            channelUpdated: channelUpdateResult.modifiedCount,
            videosUpdated: videosUpdateResult.modifiedCount,
        };
    } catch (error) {
        console.error("Erro ao atualizar o canal e vídeos associados:", error.message);
        throw error;
    }
}

/**
 * Remove um canal e todos os vídeos associados ao canal.
 * @param {string} channelId - O ID do canal a ser removido.
 * @returns {Promise<Object>} - Resultado da operação de remoção.
 */
async deleteChannelAndVideos(channelId) {
  if (!channelId) {
      throw new Error("O ID do canal é obrigatório.");
  }

  try {
      // Remove o canal
      const channelDeletionResult = await this.collection.deleteOne({ channelId });

      if (channelDeletionResult.deletedCount === 0) {
          throw new Error("Canal não encontrado.");
      }

      console.log(`Canal com ID ${channelId} removido com sucesso.`);

      // Remove os vídeos associados ao canal
      const videosCollection = this.db.collection("video");
      const videosDeletionResult = await videosCollection.deleteMany({ channel_id: channelId });

      console.log(`Foram removidos ${videosDeletionResult.deletedCount} vídeos associados ao canal.`);

      return {
          channelRemoved: channelDeletionResult.deletedCount,
          videosRemoved: videosDeletionResult.deletedCount,
      };
  } catch (error) {
      console.error("Erro ao remover o canal e vídeos associados:", error.message);
      throw error;
  }
}

}
