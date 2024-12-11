import clientPromise from "../mongodb";
const { fetchVideosFromChannel } = require("./videoServices");
import SyncronizesRepository from "./syncronizeRepository";
import ChannelRepository from "./channelRepository";
import VideosRepository from "./videoRepository";
import { translateToPortuguese } from "../translate";

const syncronize = async (
  channels_ids = null,
  num_syncronize = null,
  startDate = null,
  endDate = null
) => {
  const client = await clientPromise;
  const syncronizeRepository = new SyncronizesRepository(client);
  const channelRepository = new ChannelRepository(client);
  const videosRepository = new VideosRepository(client);

  const filterChannel = channels_ids ? { channels_ids: channels_ids } : {};
  const channels = await channelRepository.getAllChannels(filterChannel);

  const isFirstSync = !(await syncronizeRepository.countSyncronize());
  let dbDataSyncronize = await syncronizeRepository.getFirst();
  const dataSyncronize = dbDataSyncronize ? dbDataSyncronize : {};
  if (!channels_ids) {
    dataSyncronize.latest_full_syncronize = new Date();
  }

  const limitSearch =
    isFirstSync && (!num_syncronize || num_syncronize < 100)
      ? 100
      : num_syncronize;

  const apiAllVideos = [];

  for (const channel of channels) {
    if (!dataSyncronize.channels) {
      dataSyncronize.channels = {};
    }

    dataSyncronize.channels[channel.channelId] = channel;
    dataSyncronize.channels.latest_syncronize = new Date();

    const videos = await fetchVideosFromChannel(
      channel.channelId,
      limitSearch,
      startDate,
      endDate
    );

    const videosDetails = videos.map((video) => ({
      ...video,
      channel,
      published_at: new Date(video.published_at),
    }));

    apiAllVideos.push(...videosDetails);
  }

  const videosUrls = apiAllVideos.map((video) => video.video_url);
  const dbVideosFilter = { videos_urls: videosUrls };
  const dbAllVideos = await videosRepository.getAllVideos(dbVideosFilter);

  const filteredApiVideos = !dbAllVideos.length ? apiAllVideos : apiAllVideos.filter(
    (apiVideo) =>
      !dbAllVideos.some((dbVideo) => dbVideo.video_url === apiVideo.video_url)
  );

  if (!filteredApiVideos.length) {
    return filteredApiVideos;
  }

  const translatedVideos = await Promise.all(
    filteredApiVideos.map(async (video) => ({
      ...video,
      title_presentation: await translateToPortuguese(
        video.channel.targetLanguage,
        video.title
      ),
    }))
  );

  // Inserir vídeos no banco
  const videosSyncronize = await videosRepository.insertVideos(
    translatedVideos
  );
  if (dbDataSyncronize){
      await syncronizeRepository.update(dataSyncronize);
  }
  else {
    await syncronizeRepository.insert(dataSyncronize);
  }
  return videosSyncronize;
};
module.exports = {
  syncronize,
};
