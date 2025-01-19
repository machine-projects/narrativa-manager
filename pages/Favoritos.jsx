import React, { useState, useEffect } from "react";
import NavBarComponent from "../components/NavBarComponent";
import VideoFiltersComponent from "../components/VideoFiltersComponent";
import axios from "axios";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    channel_id: "",
    channels_ids: "",
    videos_urls: "",
    published_after: "",
    published_before: "",
    keywords_in_title: "",
    keywords_in_title_presentation: "",
    targets: "",
    targetLanguage: "",
    type_platforms: "",
    adm_channel_id: "",
    channel_name: "",
    channel_name_presentation: "",
    favorite:"true"
  });
  const fetchVideos = async () => {
    setLoading(true);
    try {
      // Filtra apenas os filtros com valores válidos
      const validFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value)
      );
  
      // Serializa arrays como strings separadas por vírgulas
      const serializedFilters = {
        ...validFilters,
        channels_ids: Array.isArray(validFilters.channels_ids)
          ? validFilters.channels_ids.join(",")
          : validFilters.channels_ids,
        targets: Array.isArray(validFilters.targets)
          ? validFilters.targets.join(",")
          : validFilters.targets,
      };
  
      const { data } = await axios.get(`/api/videos`, {
        params: {
          page,
          limit: 10,
          ...serializedFilters,
        },
      });
      setVideos(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchVideos();
  }, [page]);

  const handlePageChange = (direction) => {
    if (direction === "prev" && page > 1) {
      setPage(page - 1);
    } else if (direction === "next" && page < totalPages) {
      setPage(page + 1);
    }
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
              <div className="col-md-4 mb-3" key={video._id}>
                <div className="card">
                  <img
                    src={video.thumbnails[3]?.url || video.image}
                    alt={video.title}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{video.title_presentation}</h5>
                    <p className="card-text text-muted">
                      Visualizações: {video.views?.pretty || "N/A"}
                    </p>
                    <p className="card-text text-muted">
                      Publicado em:{" "}
                      {new Date(video.published_at).toLocaleDateString() || "N/A"}
                    </p>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Explorar
                    </a>
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
            Página {page} de {totalPages}
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
    </div>
  );
};

export default Home;
