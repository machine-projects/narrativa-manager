import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag"; // Importe o componente de bandeira
import { FaCheckCircle } from "react-icons/fa";
import NavBarComponent from "./NavBarComponent";
import VideoFiltersComponent from "./VideoFiltersComponent";
import ExplorarVideosModal from "./ExplorarVideosModal";

const VideoDisplayComponent = ({
  videos,
  loading,
  page,
  setPage,
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

  const getCountryCode = (targetLanguage) => {
    const languageToCountry = {
      af: "ZA", // Afrikaans - África do Sul
      am: "ET", // Amárico - Etiópia
      ar: "SA", // Árabe - Arábia Saudita
      az: "AZ", // Azerbaijano - Azerbaijão
      be: "BY", // Bielorrusso - Bielorrússia
      bg: "BG", // Búlgaro - Bulgária
      bn: "BD", // Bengali - Bangladesh
      bs: "BA", // Bósnio - Bósnia e Herzegovina
      ca: "ES", // Catalão - Espanha
      ceb: "PH", // Cebuano - Filipinas
      co: "FR", // Corso - França (Córsega)
      cs: "CZ", // Tcheco - República Tcheca
      cy: "GB", // Galês - Reino Unido (País de Gales)
      da: "DK", // Dinamarquês - Dinamarca
      de: "DE", // Alemão - Alemanha
      el: "GR", // Grego - Grécia
      en: "US", // Inglês - Estados Unidos
      eo: "EU", // Esperanto - Internacional
      es: "ES", // Espanhol - Espanha
      et: "EE", // Estoniano - Estônia
      eu: "ES", // Basco - Espanha
      fa: "IR", // Persa - Irã
      fi: "FI", // Finlandês - Finlândia
      fr: "FR", // Francês - França
      fy: "NL", // Frísio - Países Baixos
      ga: "IE", // Irlandês - Irlanda
      gd: "GB", // Gaélico Escocês - Reino Unido (Escócia)
      gl: "ES", // Galego - Espanha
      gu: "IN", // Guzerate - Índia
      ha: "NG", // Hauçá - Nigéria
      haw: "US", // Havaiano - EUA (Havaí)
      he: "IL", // Hebraico - Israel
      hi: "IN", // Hindi - Índia
      hmn: "CN", // Hmong - China
      hr: "HR", // Croata - Croácia
      ht: "HT", // Crioulo Haitiano - Haiti
      hu: "HU", // Húngaro - Hungria
      hy: "AM", // Armênio - Armênia
      id: "ID", // Indonésio - Indonésia
      ig: "NG", // Igbo - Nigéria
      is: "IS", // Islandês - Islândia
      it: "IT", // Italiano - Itália
      ja: "JP", // Japonês - Japão
      jw: "ID", // Javanês - Indonésia
      ka: "GE", // Georgiano - Geórgia
      kk: "KZ", // Cazaque - Cazaquistão
      km: "KH", // Khmer - Camboja
      kn: "IN", // Canarês - Índia
      ko: "KR", // Coreano - Coreia do Sul
      ku: "IQ", // Curdo - Iraque
      ky: "KG", // Quirguiz - Quirguistão
      la: "VA", // Latim - Vaticano
      lb: "LU", // Luxemburguês - Luxemburgo
      lo: "LA", // Lao - Laos
      lt: "LT", // Lituano - Lituânia
      lv: "LV", // Letão - Letônia
      mg: "MG", // Malagasy - Madagascar
      mi: "NZ", // Maori - Nova Zelândia
      mk: "MK", // Macedônio - Macedônia do Norte
      ml: "IN", // Malaiala - Índia
      mn: "MN", // Mongol - Mongólia
      mr: "IN", // Marathi - Índia
      ms: "MY", // Malaio - Malásia
      mt: "MT", // Maltês - Malta
      my: "MM", // Birmanês - Mianmar
      ne: "NP", // Nepalês - Nepal
      nl: "NL", // Holandês - Países Baixos
      no: "NO", // Norueguês - Noruega
      ny: "MW", // Nianja - Malaui
      or: "IN", // Oriá - Índia
      pa: "PK", // Punjabi - Paquistão
      pl: "PL", // Polonês - Polônia
      ps: "AF", // Pastó - Afeganistão
      pt: "BR", // Português - Brasil
      ro: "RO", // Romeno - Romênia
      ru: "RU", // Russo - Rússia
      rw: "RW", // Kinyarwanda - Ruanda
      sd: "PK", // Sindi - Paquistão
      si: "LK", // Cingalês - Sri Lanka
      sk: "SK", // Eslovaco - Eslováquia
      sl: "SI", // Esloveno - Eslovênia
      sm: "WS", // Samoano - Samoa
      sn: "ZW", // Shona - Zimbábue
      so: "SO", // Somali - Somália
      sq: "AL", // Albanês - Albânia
      sr: "RS", // Sérvio - Sérvia
      st: "ZA", // Sesoto - África do Sul
      su: "ID", // Sundanês - Indonésia
      sv: "SE", // Sueco - Suécia
      sw: "TZ", // Suaíli - Tanzânia
      ta: "IN", // Tâmil - Índia
      te: "IN", // Télugo - Índia
      tg: "TJ", // Tadjique - Tajiquistão
      th: "TH", // Tailandês - Tailândia
      tk: "TM", // Turcomano - Turcomenistão
      tl: "PH", // Tagalo - Filipinas
      tr: "TR", // Turco - Turquia
      tt: "RU", // Tatar - Rússia
      ug: "CN", // Uigur - China
      uk: "UA", // Ucraniano - Ucrânia
      ur: "PK", // Urdu - Paquistão
      uz: "UZ", // Uzbeque - Uzbequistão
      vi: "VN", // Vietnamita - Vietnã
      xh: "ZA", // Xhosa - África do Sul
      yi: "IL", // Iídiche - Israel
      yo: "NG", // Iorubá - Nigéria
      zh: "CN", // Chinês - China
      "zh-TW": "TW", // Chinês Tradicional - Taiwan
      zu: "ZA", // Zulu - África do Sul
    };
  
    return languageToCountry[targetLanguage] || "WW"; // "WW" para um ícone padrão (mundo)
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
          setPage={setPage}
        />

        {/* Exibição de vídeos */}
        {loading ? (
          <div className="text-center">Carregando...</div>
        ) : (
          <div className="row">
            {videos.map((video) => (
              <div className="col-md-4 mb-3" key={video?._id || Math.random()}>
                <div className="card"   style={{ backgroundColor: video?.applied ? "#f0f0f0" : "white" }}>
                  {/* Container da imagem com a bandeira */}
                  <div style={{ position: "relative" }}>
                  {video?.applied && (
                      <FaCheckCircle
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          color: "green",
                          fontSize: "24px",
                          zIndex: 2,
                        }}
                      />
                    )}
                    {/* Bandeira do país */}
                    {video?.channel?.targetLanguage && (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          zIndex: 1,
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "50%",
                          padding: "2px",
                        }}
                      >
                        <ReactCountryFlag
                          countryCode={getCountryCode(video.channel.targetLanguage)}
                          svg
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                    )}

                    {/* Imagem do vídeo */}
                    <img
                      src={
                        Array.isArray(video?.thumbnails) && video.thumbnails[3]?.url
                          ? video.thumbnails[3].url
                          : video?.image || "default-image.jpg"
                      }
                      alt={typeof video?.title === "string" ? video.title : "Sem título"}
                      className="card-img-top"
                    />
                  </div>

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