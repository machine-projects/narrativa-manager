import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const VideoDownloads = ({ videoUrl }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownloadSubtitles = (serviceUrl) => {
    if (!videoUrl) {
      alert("URL do vídeo não está disponível.");
      return;
    }

    const videoUrlEncoded = encodeURIComponent(videoUrl);
    const fullUrl = `${serviceUrl}${videoUrlEncoded}`;
    window.open(fullUrl, "_blank");
  };


  const handleDownloadVideo = async () => {
    if (!videoUrl) {
      alert("URL do vídeo não está disponível.");
      return;
    }

    setIsDownloading(true);
    setProgress(0);

    try {
 
    } catch (error) {
    
    } finally {
    
    }
  };

  return (
    <>
      <div className="mb-4">
        <h6>Download de Legendas</h6>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={() => handleDownloadSubtitles("https://www.downloadyoutubesubtitles.com/pt/?u=")}>Download via DownloadYouTubeSubtitles</button>
          <button className="btn btn-outline-primary" onClick={() => handleDownloadSubtitles("https://downsub.com/?url=")}>Download via DownSub</button>
        </div>
      </div>

      <div className="mb-4">
        <h6>Download de Vídeo</h6>
        <button className="btn btn-outline-primary" onClick={() =>   window.open("https://y2down.cc/en/", "_blank")}>Download via DownSub</button>
        <button className="btn btn-outline-primary" onClick={() =>   window.open("https://transkriptor.com/pt-br/downloader-de-video-do-youtube/", "_blank")}>Download via Transkriptor</button>
        <button className="btn btn-outline-primary" onClick={() =>   window.open("https://zeemo.ai/pt/tools/youtube-video-downloader", "_blank")}>Download via Zeemo</button>
        <button className="btn btn-outline-primary" onClick={() =>   window.open("https://pt2.savefrom.net/", "_blank")}>Download via Savefrom</button>
        <button className="btn btn-outline-primary" onClick={() =>   window.open("https://y2meta.lc/pt/", "_blank")}>Download via Y2meta</button>
        <button className="btn btn-outline-primary" onClick={() =>   window.open("https://greenconvert.net/pt10/", "_blank")}>Download via Greenconvert</button>
      </div>
      <div className="mb-4">
        <h6>Download de Audio</h6>
        <button className="btn btn-outline-primary" onClick={() =>   window.open("https://mp3converter.fr/pt/youtube-para-mp3/", "_blank")}>Download via Mp3converter</button>
        <button className="btn btn-outline-primary" onClick={() =>   window.open("https://transkriptor.com/pt-br/downloader-de-audio-do-youtube/", "_blank")}>Download via Transkriptor</button>
        <button className="btn btn-outline-primary" onClick={() =>   window.open("https://y2meta.lc/pt/youtube-to-mp3/", "_blank")}>Download via Y2meta</button>
        <button className="btn btn-outline-primary" onClick={() =>   window.open("https://greenconvert.net/pt10/youtube-mp3/", "_blank")}>Download via Greenconvert</button>
        <button className="btn btn-outline-primary" onClick={() =>   window.open("https://app.aiseo.ai/pt/tools/youtube-to-mp3", "_blank")}>Download via Aiseo</button>
      </div>
    </>
  );
};

VideoDownloads.propTypes = {
  videoUrl: PropTypes.string.isRequired,
};

export default VideoDownloads;
