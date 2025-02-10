import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import VideoDownloads from "./VideoDownloads"; 

const ExplorarVideosModal = ({ videoData, onClose }) => {
  // Validações iniciais para garantir que os dados existam antes de usar
  const [visible, setVisible] = useState(
    typeof videoData?.visible === "boolean" ? videoData.visible : false
  );
  const [favorite, setFavorite] = useState(
    typeof videoData?.favorite === "boolean" ? videoData.favorite : false
  );
  const [applied, setApplied] = useState(
    typeof videoData?.applied === "boolean" ? videoData.applied : false
  );
  
  const [isModified, setIsModified] = useState(false);

  const handleApply = async () => {
    try {
      const payload = { ...videoData };
      payload.visible = visible;
      payload.favorite = favorite;
      payload.applied = applied;

      if (!payload._id) {
        throw new Error("ID do vídeo é inválido ou está ausente.");
      }

      await axios.put("/api/videos", payload);

      alert("Alterações aplicadas com sucesso!");
      setIsModified(false);
    } catch (error) {
      console.error("Erro ao aplicar alterações:", error);
      alert("Erro ao aplicar alterações. Tente novamente.");
    }
  };

  const handleChange = (setter, value) => {
    setter(value);
    setIsModified(true);
  };

  return (
    <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {typeof videoData?.title_presentation === "string"
                ? videoData.title_presentation
                : "Título não disponível"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3 text-center">
              {videoData?.embed?.iframeUrl && typeof videoData.embed.iframeUrl === "string" ? (
                <iframe
                  src={videoData.embed.iframeUrl}
                  title={
                    typeof videoData?.title_presentation === "string"
                      ? videoData.title_presentation
                      : "Vídeo"
                  }
                  width="100%"
                  height="400"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              ) : (
                <p>O link do vídeo não está disponível.</p>
              )}
            </div>

            {/* Usando o componente VideoDownloads */}
            <VideoDownloads videoUrl={videoData.url} />

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="visibleCheckbox"
                checked={visible}
                onChange={(e) => handleChange(setVisible, e.target.checked)}
              />
              <label className="form-check-label" htmlFor="visibleCheckbox">
                Visível
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="favoriteCheckbox"
                checked={favorite}
                onChange={(e) => handleChange(setFavorite, e.target.checked)}
              />
              <label className="form-check-label" htmlFor="favoriteCheckbox">
                Favorito
              </label>
            </div>
            <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="appliedCheckbox"
              checked={applied}
              onChange={(e) => handleChange(setApplied, e.target.checked)} // Convertendo para booleano corretamente
            />

              <label className="form-check-label" htmlFor="appliedCheckbox">
                Aplicado
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Fechar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleApply}
              disabled={!isModified}
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ExplorarVideosModal.propTypes = {
  videoData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title_presentation: PropTypes.string,
    visible: PropTypes.bool,
    favorite: PropTypes.bool,
    applied_videos: PropTypes.bool,
    embed: PropTypes.shape({
      iframeUrl: PropTypes.string,
    }),
    url: PropTypes.string, // Adicionado para a URL do vídeo
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExplorarVideosModal;