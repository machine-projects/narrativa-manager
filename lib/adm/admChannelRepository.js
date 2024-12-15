
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
