import clientPromise from '../mongodb';
const { buildUrlIframeDownloadVideoAudio } = require('./videoServices');
import { getChannelDetails } from './channelServices';
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
            const collection = db.collection('channel');

            const channelRepository = new ChannelRepository(client);
            const videosRepository = new VideosRepository(client);

            // Obtém todos os vídeos
            const dbAll = await channelRepository.getAllChannels();
            // Itera sobre os vídeos e cria atualizações em massa
            const bulkOperations = await Promise.all(
                dbAll.map(async (channel) => {
                    const datails = await getChannelDetails(channel.channelId);
                    // const urlIframeDownload = buildUrlIframeDownloadVideoAudio(video.url);
                    // const downloadSubtitles = buildSubtitleDownloadUrl(video.url, video.channel.targetLanguage);

                    return {
                        updateOne: {
                            filter: { _id: channel._id }, // Localiza o vídeo pelo ID
                            update: {
                                $set: {
                                    // url_iframe_download_video_audio: urlIframeDownload,
                                    // download_subtitles: downloadSubtitles,
                                    image: datails.image
                                }
                            }
                        }
                    };
                })
            );

            // Agora bulkOperations é uma lista de objetos resolvidos

            // Executa o update em massa
            const result = collection.bulkWrite(bulkOperations);

            console.log(`Atualizados com sucesso: ${result.modifiedCount} channels.`);
            return result;
        } catch (err) {
            console.error('Erro ao atualizar os channels em massa:', err);
            throw err;
        }
    };

    bulkUpdateVideos().catch((err) => {
        console.error('Erro no reprocessamento dos channels:', err);
    });
};
