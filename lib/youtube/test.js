import clientPromise from '../mongodb';
const { buildUrlIframeDownloadVideoAudio } = require('./videoServices');

import ChannelRepository from './channelRepository';
import VideosRepository from './videoRepository';
import { buildSubtitleDownloadUrl } from '../translate';

export const reprocessamento = () => {
    /**
     * Atualiza os dados de todos os vídeos na coleção.
     */
    const bulkUpdateVideos = async () => {
        try {
            const client = await clientPromise;

            // Configurações do banco e da coleção
            const db = client.db('projetoia'); // Aqui corrigido o uso de this
            const collection = db.collection('video');

            const channelRepository = new ChannelRepository(client);
            const videosRepository = new VideosRepository(client);

            // Obtém todos os vídeos
            const dbAllVideos = await videosRepository.getAllVideos();

            // Itera sobre os vídeos e cria atualizações em massa
            const bulkOperations = dbAllVideos.map((video) => {
                // const urlIframeDownload = buildUrlIframeDownloadVideoAudio(video.video_url);
                // const downloadSubtitles = buildSubtitleDownloadUrl(video.video_url, video.channel.targetLanguage);

                return {
                    updateOne: {
                        filter: { _id: video._id }, // Localiza o vídeo pelo ID
                        update: {
                            $set: {
                                // url_iframe_download_video_audio: urlIframeDownload,
                                // download_subtitles: downloadSubtitles,
                                visible: true
                            },
                        },
                    },
                };
            });

            // Executa o update em massa
            const result = await collection.bulkWrite(bulkOperations);

            console.log(`Atualizados com sucesso: ${result.modifiedCount} vídeos.`);
            return result;
        } catch (err) {
            console.error('Erro ao atualizar os vídeos em massa:', err);
            throw err;
        }
    };

    bulkUpdateVideos().catch((err) => {
        console.error('Erro no reprocessamento dos vídeos:', err);
    });
};
