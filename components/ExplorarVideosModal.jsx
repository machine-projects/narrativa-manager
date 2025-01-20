import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const ExplorarVideosModal = ({ videoData, onClose }) => {
  const [visible, setVisible] = useState(videoData.visible);
  const [favorite, setFavorite] = useState(videoData.favorite);
  const [applied, setApplied] = useState(videoData.applied_videos);
  const [isModified, setIsModified] = useState(false);

  const handleApply = async () => {
    try {
      const payload = {
        _id: videoData._id,
        visible,
        favorite,
        applied,
      };

      await axios.post("/api/videos", payload);

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
            <h5 className="modal-title">{videoData.title_presentation}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3 text-center">
              <iframe
                src={videoData.embed.iframeUrl}
                title={videoData.title_presentation}
                width="100%"
                height="400"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
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
                onChange={(e) => handleChange(setApplied, e.target.checked)}
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
  videoData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExplorarVideosModal;
