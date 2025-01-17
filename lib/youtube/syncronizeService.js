import clientPromise from "../mongodb";
import { fetchVideosFromChannel } from "./videoServices";
import SyncronizesRepository from "./syncronizeRepository";
import ChannelRepository from "./channelRepository";
import VideosRepository from "./videoRepository";
import { translateToPortuguese } from "../translate";

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
  channel_id,
  num_syncronize,
  startDate,
  endDate
) => {
  const allvideosChannel = await getAllvideosObjectKey(channel_id);
  const videos = await fetchVideosFromChannel(
    channel_id,
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
      result.update.push(videoCadastrado);
    } else {
      const newVideo = {
        ...video,
        channel: channel_id,
        published_at: new Date(video.published_at),
        visible: true,
        favorite: false,
        title_presentation: await translateToPortuguese(
          video.channel.targetLanguage,
          video.title
        ),
      };
      result.insert.push(newVideo);
    }
  }
  return result;
};

const syncronize = async (
  channels_ids = [],
  num_syncronize = 50,
  startDate = null,
  endDate = null
) => {
  const client = await clientPromise;
  const syncronizeRepository = new SyncronizesRepository(client);
  const videosRepository = new VideosRepository(client);
  const channelRepository = new ChannelRepository(client);


  if (!channels_ids.length){
    return { error: "Canal ainda não foi cadastrado: " + channels_ids.join(" "), };
  }
  
  let videosInsert = [];
  let videosUpdate = [];
  const filterChannel = { channels_ids };
  const channels = await channelRepository.getAllChannels(filterChannel);
  if (channels.length < channels_ids.length){

    return { error: "Canal ainda não foi cadastrado: " + channels_ids.join(" "), };
  }

  for (const channel_id of channels_ids) {
    const getVideosToInsertUpdate = await videosToUpdateAndInsert(
      channel_id,
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
      videosUpdate = videosUpdate.concat(updateResult.modifiedCount);
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

export { syncronize };
