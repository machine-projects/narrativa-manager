export default class ChannelRepository {
  constructor(client) {
    this.db = client.db("projetoia");
    this.collection = this.db.collection("adm-channel");
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
}
