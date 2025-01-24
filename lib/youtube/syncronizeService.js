import clientPromise from "../mongodb";
import { fetchVideosFromChannel } from "./videoServices";
import { translateToPortuguese } from "../translate";
import SyncronizesRepository from "./syncronizeRepository";
import ChannelRepository from "./channelRepository";
import VideosRepository from "./videoRepository";

const getAllvideosObjectKey = async (channel_id) => {
  const client = await clientPromise;
  const videosRepository = new VideosRepository(client);
  const videosChannel = await videosRepository.getAllVideos({ channel_id });
  if (!videosChannel) return {};
  const videoObject = {};
  videosChannel.forEach((video) => {
    videoObject[video.url] = video;
  });
  return videoObject;
};

const videosToUpdateAndInsert = async (
  channel,
  num_syncronize,
  startDate,
  endDate
) => {
  const allvideosChannel = await getAllvideosObjectKey(channel.channelId);
  const videos = await fetchVideosFromChannel(
    channel.channelId,
    num_syncronize,
    startDate,
    endDate
  );

  const result = { update: [], insert: [] };

  for (const video of videos) {
    const videoCadastrado = allvideosChannel[video.url];
    if (videoCadastrado) {
      videoCadastrado.uploaded = video.uploaded;
      videoCadastrado.views = video.views;

//remover
      //videoCadastrado.title_presentation= await translateToPortuguese(video.title),
      result.update.push(videoCadastrado);
    } else {
      const newVideo = {
        ...video,
        channel,
        title_presentation: await translateToPortuguese(video.title),
        channel_id: channel.channelId,
        published_at: new Date(video.published_at),
        visible: true,
        favorite: false,
      };
      result.insert.push(newVideo);
    }
  }
  return result;
};

const syncronize = async (
  channels_ids = null,
  num_syncronize = 50,
  startDate = null,
  endDate = null
) => {
  const client = await clientPromise;
  const videosRepository = new VideosRepository(client);
  const syncronizeRepository = new SyncronizesRepository(client);
  const channelRepository = new ChannelRepository(client);
  const filterChannel = { channels_ids };
  const channels = await channelRepository.getAllChannels(filterChannel);

  let videosInsert = [];
  let videosUpdate = [];

  for (const channel of channels) {
    //16
    const getVideosToInsertUpdate = await videosToUpdateAndInsert(
      channel,
      num_syncronize,
      startDate,
      endDate
    );

    if (getVideosToInsertUpdate.insert.length) {
      const insertResult = await videosRepository.bulkInsert(getVideosToInsertUpdate.insert);
      videosInsert = videosInsert.concat(insertResult.insertedIds);
    }

    if (getVideosToInsertUpdate.update.length) {
      const updateResult = await videosRepository.bulkUpdate(getVideosToInsertUpdate.update);
      videosUpdate = getVideosToInsertUpdate.update.map(el => {

        return {
          channel,
          _id: el._id,
          title: el.title,
          title_presentation: el.title_presentation,
          url: el.url,
          thumbnails: el.thumbnails,
          embed: el.embed,
        }

      });
    }
  }

  

  const dataSyncronize = {
    date: new Date(),
    channels,
    videosUpdate,
    videosInsert,
  };

  await syncronizeRepository.insert(dataSyncronize);

  return dataSyncronize;
};


const getSyncronize = async (
  page, limit, filters
) => {
  const client = await clientPromise;
  const syncronizeRepository = new SyncronizesRepository(client);

  const getSyncronize = await syncronizeRepository.getPaginatedSyncronize(page, limit, filters);

  return getSyncronize;
};
module.exports = {
  syncronize,
  getSyncronize
};
