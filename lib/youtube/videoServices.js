const { google } = require('googleapis');

const YOUTUBE_API_KEY = 'AIzaSyBjjCn7KnYgRwRAJyM3kQGpu4aeg_qD34w';
const youtube = google.youtube({ version: 'v3', auth: YOUTUBE_API_KEY });

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
            return response.data.items.map((item) => ({
                channel_id: channelId,
                title: item.snippet.title,
                video_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                image: item.snippet.thumbnails.high.url,
                published_at: item.snippet.publishedAt
            }));
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

export const buildIframeDownloadVideoAudio = (videoUrl) => {
    const videoId = getYoutubeVideoId(videoUrl);

    return `
  <iframe id="widgetv2Api" height="100%" width="100%" allowtransparency="true" scrolling="yes" style="border: none; min-height:800px; display: block;" src="https://ca07.mmnm.store/mindex.php?videoId=${videoId}"></iframe>
  `;
};
module.exports = {
    fetchVideosFromChannel,
    getYoutubeVideoId,
    buildIframeDownloadVideoAudio
};
