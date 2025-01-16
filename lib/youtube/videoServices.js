const { google } = require('googleapis');

const YOUTUBE_API_KEY = 'AIzaSyBjjCn7KnYgRwRAJyM3kQGpu4aeg_qD34w';
const youtube = google.youtube({ version: 'v3', auth: YOUTUBE_API_KEY });

const getVideoDetails = async (youtube_link) => {
    try {
        const api = 'https://contentforest.com/api/tools/youtube-video-data';
        const body = {
            youtube_link: youtube_link,
            pick_keys: [
                'title',
                'url',
                'shortDescription',
                'duration',
                'thumbnails',
                'views',
                'uploaded',
                'keywords',
                'category',
                'embed'
            ]
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
        data["title"] = data.name
        data["description"]= data.shortDescription,
        data["image"]= data.thumbnails[0].url
        return data;
    } catch (error) {
        console.error('Erro ao buscar informações do canal ', error);
        return FaMailBulk;
    }
};

/**
 * Obtém vídeos de um canal filtrados por intervalo de datas.
 * @param {string} channelId - ID do canal.
 * @param {number} maxResults - Número máximo de vídeos a buscar.
 * @param {string} startDate - Data inicial (formato ISO 8601).
 * @param {string} endDate - Data final (formato ISO 8601).
 * @returns {Promise<Array>} - Lista de vídeos no intervalo de datas.
 */
const fetchVideosFromChannel = async (channelId, maxResults, startDate = null, endDate = null) => {
    try {
        const filter = {
            part: ['snippet'],
            channelId,
            type: 'video',
            maxResults,
            order: 'date'
        };
        if (startDate) {
            filter.publishedAfter = startDate;
        }
        if (endDate) {
            filter.publishedBefore = endDate;
        }

        const response = await youtube.search.list(filter);
        if (response.data?.items?.length > 0) {
            const details = [];
        
            for (const item of response.data.items) {
                const datails = await getVideoDetails(`https://www.youtube.com/watch?v=${item.id.videoId}`);
                datails['channel_id'] = channelId;
                datails['published_at'] = item.snippet.publishedAt;
                datails["title"]= item.snippet.title,
                details.push(datails);
            }
        
            return details;
        }
        
        return [];
        
    } catch (error) {
        console.error(`Erro ao buscar vídeos por data do canal '${channelId}':`, error.message);
        return [];
    }
};

const getYoutubeVideoId = (videoUrl) => {
    const videoIdMatch = videoUrl.match(/v=([\w-]+)/);
    if (!videoIdMatch) {
        throw new Error('URL do vídeo inválida ou ID não encontrado.');
    }

    return videoIdMatch[1];
};
module.exports = {
    fetchVideosFromChannel,
    getYoutubeVideoId,

    getVideoDetails
};
