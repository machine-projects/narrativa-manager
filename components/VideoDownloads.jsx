import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const VideoDownloads = ({ videoUrl }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Função para abrir o link de download de legendas
  const handleDownloadSubtitles = (serviceUrl) => {
    if (!videoUrl) {
      alert("URL do vídeo não está disponível.");
      return;
    }

    const videoUrlEncoded = encodeURIComponent(videoUrl);
    const fullUrl = `${serviceUrl}${videoUrlEncoded}`;
    window.open(fullUrl, "_blank");
  };

  // Função para iniciar o download do vídeo
  const handleDownloadVideo = async () => {
    if (!videoUrl) {
      alert("URL do vídeo não está disponível.");
      return;
    }

    setIsDownloading(true); // Ativa o estado de "baixando"

    try {
      // Primeira requisição para obter o ID do download
      const firstResponse = await axios.get(
        `https://p.oceansaver.in/ajax/download.php?format=1080&url=${encodeURIComponent(
          videoUrl
        )}`
      );

      if (!firstResponse.data.success) {
        throw new Error("Erro ao iniciar o download.");
      }

      const { id } = firstResponse.data;

      // Segunda requisição para obter o link de download
      const secondResponse = await axios.get(
        `https://p.oceansaver.in/ajax/progress.php?id=${id}`
      );

      if (secondResponse.data.success !== 1 || !secondResponse.data.download_url) {
        throw new Error("Erro ao obter o link de download.");
      }

      // Abre o link de download em uma nova aba
      window.open(secondResponse.data.download_url, "_blank");
    } catch (error) {
      console.error("Erro ao baixar o vídeo:", error);
      alert("Erro ao baixar o vídeo. Tente novamente.");
    } finally {
      setIsDownloading(false); // Desativa o estado de "baixando"
    }
  };

  return (
    <>
      {/* Seção de Downloads de Legendas */}
      <div className="mb-4">
        <h6>Download de Legendas</h6>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() =>
              handleDownloadSubtitles("https://www.downloadyoutubesubtitles.com/pt/?u=")
            }
          >
            Download via DownloadYouTubeSubtitles
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() =>
              handleDownloadSubtitles("https://downsub.com/?url=")
            }
          >
            Download via DownSub
          </button>
        </div>
      </div>

      {/* Seção de Download de Vídeo */}
      <div className="mb-4">
        <h6>Download de Vídeo</h6>
        <button
          className="btn btn-outline-success"
          onClick={handleDownloadVideo}
          disabled={isDownloading} // Desabilita o botão durante o download
        >
          {isDownloading ? "Baixando..." : "Download via y2down"}
        </button>
      </div>
    </>
  );
};

VideoDownloads.propTypes = {
  videoUrl: PropTypes.string.isRequired, // URL do vídeo
};

export default VideoDownloads;