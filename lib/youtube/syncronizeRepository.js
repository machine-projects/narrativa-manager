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


 /**
   * Obtém uma lista paginada de canais.
   * @param {number} skip - Número de documentos a ignorar.
   * @param {number} limit - Número de documentos a retornar.
   * @returns {Promise<Array>}
   */
  async getPaginatedSyncronize(skip, limit) {
    return await this.collection.find({}).skip(skip).limit(limit).toArray();
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

