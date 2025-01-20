export default class SyncronizesRepository {
  constructor(client) {
    this.db = client.db("projetoia");
    this.collection = this.db.collection("syncronize");
  }

  /**
   * Conta o número total de documentos na coleção.
   * @returns {Promise<number>}
   */
  async countSyncronize(v) {
    return await this.collection.countDocuments();
  }



 async getPaginatedSyncronize(page, limit, filters = {}, options = {}) {
  const skip = (page - 1) * limit;
  const query = {};

  // Aplicar filtros
  if (filters.channel_id) {
      query["channels.channelId"] = filters.channel_id;
  }

  if (filters.language) {
      query["channels.language"] = filters.language;
  }

  if (filters.targetLanguage) {
      query["channels.targetLanguage"] = filters.targetLanguage;
  }

  if (filters.type_platforms) {
      query["channels.type_platforms"] = { $in: [filters.type_platforms] };
  }


  if (filters.targets) {
      query["channels.targets"] = { $in: [filters.targets] };
  }

  if (filters.createdAfter) {
      query["channels.createdAt"] = { $gte: new Date(filters.createdAfter) };
  }

  if (filters.createdBefore) {
      query["channels.createdAt"] = {
          ...query["channels.createdAt"],
          $lte: new Date(filters.createdBefore)
      };
  }

  // Novo filtro para videos_id
  if (filters.videos_id) {
      const videoId = filters.videos_id;
      query.$or = [
          { "videosUpdate": videoId },
          { "videosInsert": { $elemMatch: { $eq: videoId } } }
      ];
  }

  const sort = options.sort || { "channels.createdAt": -1 };


  // Consulta no MongoDB
  const totalItems = await this.collection.countDocuments(query);
  const items = await this.collection
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();
  
  return {
    data: items,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
  };
}
  
  /**
   * Obtém todos os canais.
   * @returns {Promise<Array>}
   */
  async getFirst() {
    return await this.collection.findOne({});
  }

  /**
   * Obtém um canal por Channel ID.
   * @param {string} channelId
   * @returns {Promise<Object>}
   */
  async getbySyncronizelId(id) {
    return await this.collection.findOne({ id });
  }

  /**
   * atualiza um novo canal.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(data) {
    const options = { upsert: true };
    const filter = { _id: data._id }; // Filtro para encontrar o documento
    const update = { $set: data }; // Atualiza os campos no documento
    
    return await this.collection.updateOne(filter, update, options);
  }
  /**
   * Insere um novo canal.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async insert(data) {
    return await this.collection.insertOne(data);
  }

}

