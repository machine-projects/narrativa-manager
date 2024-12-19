import AdmChannelRepository from '../../../lib/adm/admChannelRepository';
import clientPromise from '../../../lib/mongodb';
import { targetLanguageToPortuguese } from '../../../lib/translate';
export default async function handler(req, res) {
 
  try {
    const client = await clientPromise;
    const admChannelRepository = new AdmChannelRepository(client);

    if (req.method === 'GET') {
      const {
        page = 1,
        limit = 10,
        channel_name_presentation,
        targets,
        createdAt
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const filters = {
        channel_name_presentation,
        targets: targets ? targets.split(',') : undefined,
        createdAt,
      };

      const result = await admChannelRepository.getPaginatedAdmChannels(
        skip,
        Number(limit),
        filters
      );

      res.status(200).json({
        total: result.total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(result.total / Number(limit)),
        data: result.data,
      });
    } else if (req.method === 'POST') {
      const { channel_name_presentation, channels, description, targets } = req.body;
      // const {  }
      if (!channel_name_presentation || !channels || !Array.isArray(channels)) {
        return res.status(400).json({ error: 'Campos obrigatórios estão ausentes ou incorretos.' });
      }

      // Validação da estrutura das plataformas em "channels"
      for (const [index, channel] of channels.entries()) {
        if (!channel.languageTarget) {
          return res.status(400).json({
            error: `O campo "language" está ausente no canal de índice ${index}.`
          });
        }
        else {
          channel.language = targetLanguageToPortuguese(channel.languageTarget)
        }
    
        if (!channel.platforms) {
          return res.status(400).json({
            error: `O campo "platforms" está ausente no canal de índice ${index}.`
          });




        }

        const platforms = ['youtube', 'tiktok', 'instagram', 'kwai'];
        for (const platform of platforms) {
    
          if (!channel.platforms[platform] || typeof channel.platforms[platform].enable !== 'boolean') {
            return res.status(400).json({
              error: `A plataforma "${platform}" no canal de índice ${index} deve incluir "enable" como um booleano.`
            });
          }
        }
      }

      const newAdmChannel = {
        channel_name_presentation,
        channels,
        description: description || '',
        targets: targets || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await admChannelRepository.insertAdmChannel(newAdmChannel);
      res.status(201).json({
        message: 'Canal administrativo adicionado com sucesso.',
        admChannel: { id: result.insertedId, ...newAdmChannel },
      });
    } else if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'O ID do canal administrativo é obrigatório.' });
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'Nenhum dado para atualização foi fornecido.' });
      }

      updateData.updatedAt = new Date();

      const result = await admChannelRepository.updateAdmChannel(id, updateData);

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Canal administrativo não encontrado.' });
      }

      res.status(200).json({ message: 'Canal administrativo atualizado com sucesso.' });
    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'O ID do canal administrativo é obrigatório.' });
      }

      const channel = await admChannelRepository.getAdmChannelById(id);
      if (!channel) {
        return res.status(404).json({ error: 'Canal administrativo não encontrado.' });
      }

      const result = await admChannelRepository.deleteAdmChannel(id);

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Erro ao remover o canal administrativo.' });
      }

      res.status(200).json({ message: 'Canal administrativo removido com sucesso.' });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Método ${req.method} não permitido.` });
    }
  } catch (error) {
    console.error('Erro no handler do AdmChannel:', error.message);
    res.status(500).json({ error: `Erro interno do servidor. ${error.message}` });
  }
}
