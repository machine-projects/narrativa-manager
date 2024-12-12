export default class VideosRepository {
    constructor(client) {
        this.db = client.db('projetoia');
        this.collection = this.db.collection('video');
    }

    /**
     * Conta o número total de documentos na coleção.
     * @returns {Promise<number>}
     */
    async countVideos() {
        return await this.collection.countDocuments();
    }

    /**
     * Obtém uma lista paginada de canais.
     * @param {number} skip - Número de documentos a ignorar.
     * @param {number} limit - Número de documentos a retornar.
     * @returns {Promise<Array>}
     */
    async getPaginatedVideos(skip, limit, filters = {}, options = {}) {
        const query = {};

        // Filtros existentes
        if (filters.channel_id) {
            query.channel_id = filters.channel_id;
        }
        if (filters.channels_ids) {
            query.channel_id = { $in: filters.channels_ids };
        }
        if (filters.videos_urls) {
            query.video_url = { $in: filters.videos_urls };
        }

        // Novos filtros
        if (filters.published_after) {
            query.published_at = { $gte: new Date(filters.published_after) };
        }
        if (filters.published_before) {
            query.published_at = { ...query.published_at, $lte: new Date(filters.published_before) };
        }
        if (filters.keywords_in_title) {
            query.title = { $regex: filters.keywords_in_title, $options: 'i' };
        }
        if (filters.keywords_in_title_presentation) {
            query.title_presentation = { $regex: filters.keywords_in_title_presentation, $options: 'i' };
        }
        if (filters.targets) {
            query['channel.targets'] = { $in: filters.targets };
        }
        if (filters.targetLanguage) {
            query['channel.targetLanguage'] = filters.targetLanguage;
        }
        if (filters.type_platforms) {
            query['channel.type_platforms'] = { $in: filters.type_platforms };
        }
        if (filters.adm_channel_id) {
            query['channel.adm_channel_id'] = filters.adm_channel_id;
        }
        if (filters.channel_name) {
            query['channel.channel_name'] = { $regex: filters.channel_name, $options: 'i' };
        }
        if (filters.channel_name_presentation) {
            query['channel.channel_name_presentation'] = { $regex: filters.channel_name_presentation, $options: 'i' };
        }

        const sort = options.sort || { published_at: -1 };
        return await this.collection.find(query).sort(sort).skip(skip).limit(limit).toArray();
    }

    /**
     * Obtém todos os vídeos com ordenação.
     * @param {Object} filters - Filtros para buscar os vídeos.
     * @param {Object} options - Opções adicionais (como ordenação).
     * @returns {Promise<Array>}
     */
    async getAllVideos(filters = {}, options = {}) {
        const query = {};

        // Adiciona filtros com base nos parâmetros
        if (filters.channel_id) {
            query.channel_id = filters.channel_id;
        }
        if (filters.channels_ids) {
            query.channel_id = { $in: filters.channels_ids };
        }
        if (filters.videos_urls) {
            query.video_url = { $in: filters.videos_urls };
        }

        // Define a ordenação padrão ou usa a ordenação fornecida
        const sort = options.sort || { published_at: -1 }; // Ordena do mais recente para o mais antigo

        // Executa a consulta com filtros e ordenação
        return await this.collection.find(query).sort(sort).toArray();
    }

    /**
     * Obtém um canal por Channel ID.
     * @param {string} channelId
     * @returns {Promise<Object>}
     */
    async getbyVideolId(id) {
        return await this.collection.findOne({ id });
    }

    /**
     * Insere um novo canal.
     * @param {Object} data
     * @returns {Promise<Object>}
     */
    async insertVideo(data) {
        return await this.collection.insertOne(data);
    }

    /**
     * Insere vários vídeos de forma bulk.
     * @param {Array<Object>} data - Array de objetos contendo os dados dos vídeos a serem inseridos.
     * @returns {Promise<Object>} - Resultado da operação de inserção.
     */
    async insertVideos(data) {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("O parâmetro 'data' deve ser um array com pelo menos um item.");
        }

        try {
            return await this.collection.insertMany(data, { ordered: true });
        } catch (error) {
            console.error('Erro ao realizar bulk insert:', error.message);
            throw error;
        }
    }

    /**
     * Atualiza um vídeo existente.
     * @param {Object} filter - Critérios para encontrar o vídeo a ser atualizado.
     * @param {Object} updateData - Dados que serão atualizados no documento.
     * @returns {Promise<Object>} - Resultado da operação de atualização.
     */
    async update(filter, updateData) {
        return await this.collection.updateOne(filter, { $set: updateData });
    }
}
