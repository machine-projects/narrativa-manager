
const { ObjectId } = require('mongodb');

export default class AdmChannelRepository {
  constructor(client) {
    this.db = client.db("projetoia");
    this.collection = this.db.collection("adm-channel");
  }



  /**
   * Adiciona um novo canal administrativo.
   * @param {Object} data - Estrutura do canal administrativo.
   * @returns {Promise<Object>} - Resultado da inserção.
   */
  async insertAdmChannel(data) {
    data.createdAt = new Date();
    data.updatedAt = new Date();
    return await this.collection.insertOne(data);
  }

  /**
   * Obtém todos os canais administrativos com suporte a filtros.
   * @param {Object} filters - Filtros opcionais.
   * @returns {Promise<Array>} - Lista de canais administrativos.
   */
  async getAllAdmChannels(filters = {}) {
    const query = {};

    if (filters.channel_name_presentation) {
      query.channel_name_presentation = { $regex: filters.channel_name_presentation, $options: "i" };
    }
    if (filters.targets) {
      query.targets = { $in: filters.targets };
    }
    if (filters.createdAt) {
      query.createdAt = { $gte: new Date(filters.createdAt) };
    }
    if (filters.ids) {

          query._id = { $in: filters.ids.map(id => id) };

  }
    return await this.collection.find(query).toArray();
  }
    /**
   * Obtém uma lista paginada de canais administrativos.
   * @param {number} skip - Número de documentos a ignorar (página atual - 1) * limite.
   * @param {number} limit - Número de documentos por página.
   * @param {Object} filters - Filtros opcionais para busca.
   * @returns {Promise<Object>} - Lista de canais administrativos com total de itens.
   */
    async getPaginatedAdmChannels(skip, limit, filters = {}) {
      const query = {};
  
      // Adiciona filtros à consulta
      if (filters.channel_name_presentation) {
        query.channel_name_presentation = {
          $regex: filters.channel_name_presentation,
          $options: "i",
        };
      }
  
      if (filters.targets) {
        query.targets = { $in: filters.targets };
      }
  
      if (filters.createdAt) {
        query.createdAt = { $gte: new Date(filters.createdAt) };
      }
  
      // Calcula o total de itens correspondentes à consulta
      const total = await this.collection.countDocuments(query);
  
      // Executa a consulta com paginação
      const data = await this.collection
        .find(query)
        .skip(skip)
        .limit(limit)
        .toArray();
  
      return {
        total,
        data,
      };
    }
  

  /**
   * Obtém um canal administrativo por ID.
   * @param {string} id - ID do canal.
   * @returns {Promise<Object>} - Canal administrativo encontrado.
   */
  async getAdmChannelById(id) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  /**
   * Atualiza um canal administrativo.
   * @param {string} id - ID do canal.
   * @param {Object} updateData - Dados para atualização.
   * @returns {Promise<Object>} - Resultado da atualização.
   */
  async updateAdmChannel(id, updateData) {
    updateData.updatedAt = new Date();
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }



/**
 * Atualiza um canal e todas as referências associadas nos vídeos.
 * @param {Object} channelUpdates - Os campos a serem atualizados no canal, incluindo o `_id`.
 * @returns {Promise<Object>} - Resultado da operação de atualização.
 */
async updateCascate(channelUpdates) {
  if (!channelUpdates || typeof channelUpdates !== "object" || !channelUpdates._id) {
      throw new Error("Os dados de atualização são obrigatórios e devem conter um '_id' válido.");
  }

  try {
      
      const admChannelId =  new ObjectId(channelUpdates._id);

      
      const { _id, ...updates } = channelUpdates;

      
      const admChannelUpdateResult = await this.collection.updateOne(
          { _id: admChannelId },
          { $set: updates }
      );

      if (admChannelUpdateResult.matchedCount === 0) {
          throw new Error("Canal não encontrado.");
      }

      console.log(`Canal com ID ${admChannelId} atualizado com sucesso.`);

      query['channel.adm_channels'] = {
        $elemMatch: { _id: filters.adm_channel_id },
    };
      const channelCollection = this.db.collection("channel");
      const channelUpdateResult = await channelCollection.updateMany(
        { "adm_channels": { $elemMatch: { _id: filters.adm_channel_id } } },
        { $set: { channel: updates } }
    );
      const videosCollection = this.db.collection("video");
      const videosUpdateResult = await videosCollection.updateMany(
        { "channel.adm_channels": { $elemMatch: { _id: filters.adm_channel_id } } },
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
   * Adiciona uma nova plataforma a um canal administrativo.
   * @param {string} id - ID do canal administrativo.
   * @param {string} platform - Nome da plataforma (ex: "youtube").
   * @param {Object} platformData - Dados da plataforma.
   * @returns {Promise<Object>} - Resultado da atualização.
   */
  async addPlatformToChannel(id, platform, platformData) {
    const updatePath = `channels.$[elem].platforms.${platform}`;
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { [updatePath]: platformData } },
      { arrayFilters: [{ "elem._id": id }] }
    );
  }

  /**
   * Remove um canal administrativo.
   * @param {string} id - ID do canal.
   * @returns {Promise<Object>} - Resultado da remoção.
   */
  async deleteAdmChannel(id) {
    return await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}
