"use client"; // Certifique-se de que está rodando no cliente no Next.js

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import NavBarComponent from "components/NavBarComponent";
import VideoDownloads from "components/VideoDownloads"; // Importando o componente de download

const ExplorarVideosPage = () => {
  const searchParams = useSearchParams();
  const _id = searchParams.get("_id");

  const [videoData, setVideoData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [applied, setApplied] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (_id) {
      axios
        .get(`/api/videos?_id=${_id}&limit=1`)
        .then((response) => {
          const video = response.data;
          setVideoData(video);
          setVisible(video.visible ?? false);
          setFavorite(video.favorite ?? false);
          setApplied(video.applied ?? false);
        })
        .catch((error) => {
          console.error("Erro ao buscar vídeos:", error);
          alert("Erro ao carregar os vídeos.");
        })
        .finally(() => setLoading(false));
    }
  }, [_id]);

  const handleApply = async () => {
    try {
      if (!videoData || !videoData._id) {
        throw new Error("Dados do vídeo são inválidos.");
      }

      const payload = { ...videoData, visible, favorite, applied };
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

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Carregando...</h3>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="container mt-5 text-center">
        <h3>Vídeo não encontrado</h3>
      </div>
    );
  }

  return (
    <div>
      <NavBarComponent active="home" />
      <div className="container mt-4">
        <h2 className="text-center mb-4">{videoData.title_presentation || "Título não disponível"}</h2>

        <div className="d-flex justify-content-center">
          {videoData.embed ? (
            <iframe
              src={videoData.embed}
              title={videoData.title_presentation || "Vídeo"}
              width="80%"
              height="450"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <p className="text-center">O link do vídeo não está disponível.</p>
          )}
        </div>

        {/* Área de Downloads */}
        <div className="mt-4">
          <h4>Download do Vídeo e Legendas</h4>
          <VideoDownloads videoUrl={videoData.url} />
        </div>

        {/* Configurações */}
        <div className="mt-4">
          <h4>Configurações</h4>
          <div className="row">
            <div className="col-md-4 d-flex align-items-center">
              <label className="form-switch form-check-label me-2">Visível</label>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="visibleSwitch"
                  checked={visible}
                  onChange={(e) => handleChange(setVisible, e.target.checked)}
                />
              </div>
            </div>
            <div className="col-md-4 d-flex align-items-center">
              <label className="form-switch form-check-label me-2">Favorito</label>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="favoriteSwitch"
                  checked={favorite}
                  onChange={(e) => handleChange(setFavorite, e.target.checked)}
                />
              </div>
            </div>
            <div className="col-md-4 d-flex align-items-center">
              <label className="form-switch form-check-label me-2">Aplicado</label>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="appliedSwitch"
                  checked={applied}
                  onChange={(e) => handleChange(setApplied, e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botão de aplicar alterações */}
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-primary px-4 py-2" onClick={handleApply} disabled={!isModified}>
            Aplicar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplorarVideosPage;