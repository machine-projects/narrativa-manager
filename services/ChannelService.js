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
                    custom_name_channel: channels.custom_name_channel,
                    targetLanguage: channels.targetLanguage,
                    type_platforms: channels.type_platforms,
                    adm_channel_id: channels.adm_channel_id,
                    targets: channels.targets
                }
            );
            
            return response.statusCode === 201;
        } catch (error) {
            console.error('Erro ao criar canal:', error);
            return false;
        }
    }
}
