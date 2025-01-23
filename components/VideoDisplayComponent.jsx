import React, { useState } from "react";
import NavBarComponent from "./NavBarComponent";
import VideoFiltersComponent from "./VideoFiltersComponent";
import ExplorarVideosModal from "./ExplorarVideosModal";

const VideoDisplayComponent = ({
  videos,
  loading,
  page,
  totalPages,
  handlePageChange,
  filters,
  setFilters,
  fetchVideos,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleExploreVideo = (video) => {
    setSelectedVideo(video);
    setModalOpen(true);
  };

  return (
    <div>
      <NavBarComponent active="home" />
      <div className="container bg-light py-4">
        <h2>Todos os Vídeos</h2>

        {/* Filtros */}
        <VideoFiltersComponent
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={fetchVideos}
        />

        {/* Exibição de vídeos */}
        {loading ? (
          <div className="text-center">Carregando...</div>
        ) : (
          <div className="row">
            {videos.map((video) => (
              <div className="col-md-4 mb-3" key={video?._id || Math.random()}>
                <div className="card">
                  {/* Validação de imagem */}
                  <img
                    src={
                      Array.isArray(video?.thumbnails) && video.thumbnails[3]?.url
                        ? video.thumbnails[3].url
                        : video?.image || "default-image.jpg"
                    }
                    alt={typeof video?.title === "string" ? video.title : "Sem título"}
                    className="card-img-top"
                  />

                  <div className="card-body">
                    {/* Validação do título */}
                    <h5 className="card-title">
                      {typeof video?.title_presentation === "string" ||
                      typeof video?.title_presentation === "number"
                        ? video.title_presentation
                        : "Título inválido"}
                    </h5>

                    {/* Validação do canal */}
                    <p className="card-text text-muted">
                      Canal:{" "}
                      {typeof video?.channel?.channel_name_presentation === "string"
                        ? video.channel.channel_name_presentation
                        : "N/A"}
                    </p>

                    {/* Validação das visualizações */}
                    <p className="card-text text-muted">
                      Visualizações:{" "}
                      {typeof video?.views?.text === "string" ||
                      typeof video?.views?.pretty === "number"
                        ? video.views.text
                        : "N/A"}
                    </p>

                    {/* Validação da data de publicação */}
                    <p className="card-text text-muted">
                      Publicado em:{" "}
                      {video?.published_at &&
                      !isNaN(new Date(video.published_at).getTime())
                        ? new Date(video.published_at).toLocaleDateString()
                        : "Data inválida"}
                    </p>

                    {/* Botão para explorar */}
                    <button
                      className="btn btn-primary"
                      onClick={() => handleExploreVideo(video)}
                    >
                      Explorar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        <div className="pagination mt-4 d-flex justify-content-between">
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange("prev")}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span>
            Página {typeof page === "number" ? page : 1} de{" "}
            {typeof totalPages === "number" ? totalPages : 1}
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange("next")}
            disabled={page === totalPages}
          >
            Próxima
          </button>
        </div>
      </div>

      {/* Modal para explorar vídeo */}
      {isModalOpen && selectedVideo && (
        <ExplorarVideosModal
          videoData={selectedVideo}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default VideoDisplayComponent;
