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
}
