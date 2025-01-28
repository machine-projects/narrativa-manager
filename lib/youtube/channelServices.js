const { google } = require('googleapis');
const axios = require('axios');
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const youtube = google.youtube({ version: 'v3', auth: YOUTUBE_API_KEY });

const getChannelName = (url, witchHandle = true) => {
    const split = url.split('/');
    let name = split[split.length - 1];
    if (!witchHandle) {
        name = name.replace('@', '');
    }

    return name;
};

const getChannelDetails = async (channelId) => {
    try {

        const data = await getYtInitialData(`https://www.youtube.com/channel/${channelId}`);
        return {
            title: data.title,
            description: data.description,
            image: data.avatar.thumbnails[0].url,
            vanityChannelUrl: data.vanityChannelUrl,
            isFamilySafe: data.isFamilySafe,
            channelUrl: data.channelUrl
        };
    } catch (error) {
        console.error('Erro ao buscar informações do canal ', error);
        return FaMailBulk;
    }
};

/**
 * Faz uma requisição GET ao link do canal do YouTube e retorna o valor da variável `ytInitialData`.
 * @param {string} channelUrl - URL do canal do YouTube.
 * @returns {Promise<object|null>} - Retorna o valor da variável `ytInitialData` ou null se não encontrar.
 */
const getYtInitialData = async (channelUrl) => {
    try {
        // Faz a requisição GET para o link do canal
        const response = await axios.get(channelUrl);

        // Verifica se a resposta contém o conteúdo esperado
        if (response.data) {
            // Extrai a variável ytInitialData do conteúdo da página
            const match = response.data.match(/var ytInitialData = ({.*?});<\/script>/);

            if (match && match[1]) {
                // Retorna o valor parseado da variável ytInitialData
                const ytInitialData = JSON.parse(match[1]);
                return ytInitialData?.metadata?.channelMetadataRenderer
            } else {
                console.error('Variável ytInitialData não encontrada no conteúdo.');
                return null;
            }
        } else {
            console.error('Resposta vazia ou inválida.');
            return null;
        }
    } catch (error) {
        console.error(`Erro ao buscar ytInitialData no canal ${channelUrl}:`, error.message);
        return null;
    }
};

/**
 * Obtém o Channel ID de uma URL personalizada de canal.
 * @param {string} customUrl - URL personalizada do canal.
 * @returns {Promise<string|null>} - Retorna o Channel ID ou null se não encontrar.
 */
const getChannelIdFromCustomUrl = async (customUrl) => {
    try {
        const isUrlChannel = customUrl.search("https://www.youtube.com/channel")
        if (isUrlChannel.length > 0){
            return getChannelName(customUrl, false);
        }
        const getchannel = await getYtInitialData(customUrl);
        return getchannel.externalId;
            // const response = await youtube.search.list({
            //     part: ['snippet'],
            //     q: customName,
            //     type: 'channel',
            //     maxResults: 1

            // });
    } catch (error) {
        console.error(`Erro ao buscar o ID do canal para '${customUrl}':`, error.message);
        return null;
    }
};

/**
 * Obtém informações detalhadas de um canal do YouTube.
 * @param {string} channelId - ID do canal.
 * @returns {Promise<Object|null>} - Informações do canal.
 */
const getChannelDetailsApiYoutube = async (channelId) => {
    try {
        const response = await youtube.channels.list({
            part: ['snippet'],
            id: channelId
        });

        if (response.data?.items?.length > 0) {
            const channel = response.data.items[0];
            return {
                title: channel.snippet.title,
                description: channel.snippet.description,
                image: channel.snippet.thumbnails.high.url
            };
        } else {
            console.error(`Não foi possível encontrar detalhes para o canal '${channelId}'`);
            return null;
        }
    } catch (error) {
        console.error(`Erro ao buscar detalhes do canal '${channelId}':`, error.message);
        return null;
    }
};

module.exports = {
    getChannelIdFromCustomUrl,
    getChannelDetails,
    getChannelName
};
