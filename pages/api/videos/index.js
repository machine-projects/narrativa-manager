import clientPromise from '../../../lib/mongodb';
import VideosRepository from '../../../lib/youtube/videoRepository';

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const videosRepository = new VideosRepository(client);

        if (req.method === 'GET') {
            // Paginado ou todos os vídeos
            const {
                page = 1,
                limit = 10,
                all = false,
                channel_id,
                channels_ids,
                videos_urls,
                published_after,
                published_before,
                keywords_in_title,
                keywords_in_title_presentation,
                targets,
                targetLanguage,
                type_platforms,
                adm_channel_id,
                channel_name,
                channel_name_presentation,
                favorite
                
            } = req.query;
            const filters = {
                channel_id,
                channels_ids: channels_ids ? channels_ids.split(',') : undefined,
                videos_urls: videos_urls ? videos_urls.split(',') : undefined,
                published_after,
                published_before,
                keywords_in_title,
                keywords_in_title_presentation,
                targets: targets ? targets.split(',') : undefined,
                targetLanguage,
                type_platforms: type_platforms ? type_platforms.split(',') : undefined,
                adm_channel_id,
                channel_name,
                channel_name_presentation,
                favorite
            };
            if (all === 'true') {
                const videos = await videosRepository.getAllVideos();
                return res.status(200).json({ total: videos.length, data: videos });
            }


            const videos = await videosRepository.getPaginatedVideos(page, Number(limit), filters);

            res.status(200).json({
                ...videos
            });
        } else if (req.method === 'POST') {
            // Adicionar um novo vídeo
            const { title, channelId, description, url, publishedAt } = req.body;

            if (!title || !channelId || !url || !publishedAt) {
                return res.status(400).json({ error: 'Campos obrigatórios estão ausentes.' });
            }
            const newVideo = {
                title,
                channelId,
                description: description || '',
                url,
                applied:false,
                visible: true,
                publishedAt: new Date(publishedAt),
                createdAt: new Date()
            };

            const result = await videosRepository.insertVideo(newVideo);

            res.status(201).json({
                message: 'Vídeo adicionado com sucesso.',
                video: { id: result.insertedId, ...newVideo }
            });
        } else if (req.method === 'PUT') {
            // Atualizar um vídeo por ID
            const { id,  ...updateData } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'O ID do vídeo é obrigatório.' });
            }

            const result = await videosRepository.update({ _id: id }, { $set: updateData });

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Vídeo não encontrado.' });
            }

            let channelUpdateResult;
           
            res.status(200).json({
                message: 'Vídeo atualizado com sucesso.',
                channelUpdate: channelUpdateResult
            });
        } else if (req.method === 'DELETE') {
            // Remover um vídeo por ID
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ error: 'O ID do vídeo é obrigatório.' });
            }

            const result = await videosRepository.enableDesable({ _id: id });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Vídeo não encontrado.' });
            }

            res.status(200).json({ message: 'Vídeo removido com sucesso.' });
        } else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).json({ error: `Método ${req.method} não permitido.` });
        }
    } catch (error) {
        console.error('Erro no handler de vídeos:', error.message);
        res.status(500).json({ error: `Erro interno do servidor. ${error.message}` });
    }
}
