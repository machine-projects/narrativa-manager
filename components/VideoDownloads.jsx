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

  const checkProgress = async (id) => {
    try {
      const response = await axios.get(
        `https://p.oceansaver.in/ajax/progress.php?id=${id}`
      );
      
      if (!response.data) {
        throw new Error("Erro ao verificar o progresso.");
      }

      if (response.data.progress) {
        setProgress(response.data.progress / 10); // Normaliza para 0-100%
      }

      if (response.data.progress === 1000 && response.data.download_url) {
        return response.data.download_url;
      }
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return checkProgress(id);
    } catch (error) {
      console.error("Erro ao verificar o progresso:", error);
      throw error;
    }
  };

  const handleDownloadVideo = async () => {
    if (!videoUrl) {
      alert("URL do vídeo não está disponível.");
      return;
    }

    setIsDownloading(true);
    setProgress(0);

    try {
      const firstResponse = await axios.get(
        `https://p.oceansaver.in/ajax/download.php?format=1080&url=${encodeURIComponent(videoUrl)}`
      );

      if (!firstResponse.data.success) {
        throw new Error("Erro ao iniciar o download.");
      }

      const { id } = firstResponse.data;
      const downloadUrl = await checkProgress(id);

      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      } else {
        throw new Error("Link de download não disponível.");
      }
    } catch (error) {
      console.error("Erro ao baixar o vídeo:", error);
      alert("Erro ao baixar o vídeo. Tente novamente.");
    } finally {
      setIsDownloading(false);
      setProgress(0);
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
        <button className="btn btn-outline-success" onClick={handleDownloadVideo} disabled={isDownloading}>
          {isDownloading ? `Baixando... (${progress}%)` : "Download via y2down"}
        </button>

        {isDownloading && (
          <div className="progress mt-2">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progress}%
            </div>
          </div>
        )}
      </div>
    </>
  );
};

VideoDownloads.propTypes = {
  videoUrl: PropTypes.string.isRequired,
};

export default VideoDownloads;
