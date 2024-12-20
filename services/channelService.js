import { BaseService } from "./baseService";

export class ChannelService extends BaseService {
    static async listChannels(page) {
        super.get();
    }
}