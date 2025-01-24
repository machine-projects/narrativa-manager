import { BaseService } from './BaseService';

export class ChannelService extends BaseService {
    static listChannels(page, itemsLimit) {
        return super.get({
            url: `/api/channels?page=${page}&limit=${itemsLimit}`,
            headers: {
                'Content-Type': 'application/json'
            },
            allowCache: false
        });
    }

    static async createChannel(channels) {
        try {
            const response = await super.post(
                '/api/channels',
                {
                    'Content-Type': 'application/json'
                },
                {
                    url: channels.channelUrl,
                    targetLanguage: channels.targetLanguage,
                    type_platforms: channels.type_platforms,
                    adm_channels: channels.adm_channels,
                    targets: channels.targets
                }
            );
            
            return response
        } catch (error) {
            console.error('Erro ao criar canal:', error);
            return false;
        }
    }

    static async getAdmChannels() {
        try {
            const response = await super.get({
                url: '/api/adm-channels',
                headers: {
                    'Content-Type': 'application/json'
                },
                allowCache: false
            });

            return response.data;
        } catch (error) {
            console.error('Erro ao buscar canais administradores:', error);
            return [];
        }
    }
}
