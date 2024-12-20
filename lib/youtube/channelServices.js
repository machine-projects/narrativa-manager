const { google } = require('googleapis');

const YOUTUBE_API_KEY = 'AIzaSyBjjCn7KnYgRwRAJyM3kQGpu4aeg_qD34w';
const youtube = google.youtube({ version: 'v3', auth: YOUTUBE_API_KEY });

const getChannelDetails = async (channelId) => {
  try{
    const api =   "https://contentforest.com/api/tools/youtube-channel-data";
    const body = {
          youtube_channel_link: `https://www.youtube.com/channel/${channelId}`,
          pick_keys: ['name', 'description', 'thumbnails']
      };
  
      const response = await fetch(`${api}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
  
    });
  
    if (!response.ok) {
      console.error('Erro ao buscar informações do canal');
      return null;
    }
  
    const data = await response.json();
    return {
      title: data.name,
      description: data.description,
      image: data.thumbnails[0].url
  };

  } 
  catch (error) {
    console.error('Erro ao buscar informações do canal ', error);
    return FaMailBulk;
  }
};

/**
 * Obtém o Channel ID de uma URL personalizada de canal.
 * @param {string} customUrl - URL personalizada do canal.
 * @returns {Promise<string|null>} - Retorna o Channel ID ou null se não encontrar.
 */
const getChannelIdFromCustomUrl = async (customUrl) => {
    try {
        const response = await youtube.search.list({
            part: ['snippet'],
            q: customUrl,
            type: 'channel',
            maxResults: 1
        });

        if (response.data?.items?.length > 0) {
            return response.data.items[0].id.channelId;
        } else {
            console.error(`Não foi possível encontrar o ID do canal para '${customUrl}'`);
            return null;
        }
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
    getChannelDetails
};
