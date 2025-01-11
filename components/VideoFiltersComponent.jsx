import React, { useState, useEffect } from "react";
import axios from "axios";
import { languageMap } from '../lib/translate';
// const languageMap = {
//   "af": "Africâner",
//   "am": "Amárico",
//   "ar": "Árabe",
//   "az": "Azeri",
//   "be": "Bielorrusso",
//   "bg": "Búlgaro",
//   "bn": "Bengali",
//   "bs": "Bósnio",
//   "ca": "Catalão",
//   "ceb": "Cebuano",
//   "co": "Corso",
//   "cs": "Tcheco",
//   "cy": "Galês",
//   "da": "Dinamarquês",
//   "de": "Alemão",
//   "el": "Grego",
//   "en": "Inglês",
//   "eo": "Esperanto",
//   "es": "Espanhol",
//   "et": "Estoniano",
//   "eu": "Basco",
//   "fa": "Persa",
//   "fi": "Finlandês",
//   "fr": "Francês",
//   "fy": "Frísio",
//   "ga": "Irlandês",
//   "gd": "Gaélico Escocês",
//   "gl": "Galego",
//   "gu": "Guzerate",
//   "ha": "Hauçá",
//   "haw": "Havaiano",
//   "he": "Hebraico",
//   "hi": "Hindi",
//   "hmn": "Hmong",
//   "hr": "Croata",
//   "ht": "Crioulo Haitiano",
//   "hu": "Húngaro",
//   "hy": "Armênio",
//   "id": "Indonésio",
//   "ig": "Igbo",
//   "is": "Islandês",
//   "it": "Italiano",
//   "ja": "Japonês",
//   "jw": "Javanês",
//   "ka": "Georgiano",
//   "kk": "Cazaque",
//   "km": "Khmer",
//   "kn": "Canarim",
//   "ko": "Coreano",
//   "ku": "Curdo",
//   "ky": "Quirguiz",
//   "la": "Latim",
//   "lb": "Luxemburguês",
//   "lo": "Lao",
//   "lt": "Lituano",
//   "lv": "Letão",
//   "mg": "Malgaxe",
//   "mi": "Maori",
//   "mk": "Macedônio",
//   "ml": "Malaiala",
//   "mn": "Mongol",
//   "mr": "Marata",
//   "ms": "Malaio",
//   "mt": "Maltês",
//   "my": "Birmanês",
//   "ne": "Nepalês",
//   "nl": "Holandês",
//   "no": "Norueguês",
//   "ny": "Nianja",
//   "or": "Oriá",
//   "pa": "Punjabi",
//   "pl": "Polonês",
//   "ps": "Pachto",
//   "pt": "Português",
//   "ro": "Romeno",
//   "ru": "Russo",
//   "rw": "Kinyarwanda",
//   "sd": "Sindi",
//   "si": "Cingalês",
//   "sk": "Eslovaco",
//   "sl": "Esloveno",
//   "sm": "Samoano",
//   "sn": "Shona",
//   "so": "Somali",
//   "sq": "Albanês",
//   "sr": "Sérvio",
//   "st": "Soto do Sul",
//   "su": "Sundanês",
//   "sv": "Sueco",
//   "sw": "Suaíli",
//   "ta": "Tâmil",
//   "te": "Telugu",
//   "tg": "Tadjique",
//   "th": "Tailandês",
//   "tk": "Turcomeno",
//   "tl": "Tagalo",
//   "tr": "Turco",
//   "tt": "Tártaro",
//   "ug": "Uigur",
//   "uk": "Ucraniano",
//   "ur": "Urdu",
//   "uz": "Uzbeque",
//   "vi": "Vietnamita",
//   "xh": "Xhosa",
//   "yi": "Iídiche",
//   "yo": "Iorubá",
//   "zh": "Chinês (Simplificado)",
//   "zh-TW": "Chinês (Tradicional)",
//   "zu": "Zulu"
// }

const VideoFiltersComponent = ({ filters, setFilters, onApplyFilters }) => {
  const [admChannels, setAdmChannels] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loadingAdm, setLoadingAdm] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);

  // Função para buscar canais administrados
  const fetchAdmChannels = async () => {
    setLoadingAdm(true);
    try {
      const { data } = await axios.get(`/api/adm-channels?limit=50`);
      setAdmChannels(data.data);
    } catch (error) {
      console.error("Erro ao carregar canais administrados:", error.message);
    } finally {
      setLoadingAdm(false);
    }
  };

  // Função para buscar canais
  const fetchChannels = async () => {
    setLoadingChannels(true);
    try {
      const { data } = await axios.get(`/api/channels?limit=50`);
      setChannels(data.data);
    } catch (error) {
      console.error("Erro ao carregar canais:", error.message);
    } finally {
      setLoadingChannels(false);
    }
  };

  useEffect(() => {
    fetchAdmChannels();
    fetchChannels();
  }, []);

  // Manipulação de mudanças nos filtros
  const handleFilterChange = (e) => {
    const { name, value, options } = e.target;
    if (name === "channel_ids") {
      // Tratar seleção múltipla
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFilters({ ...filters, [name]: selectedValues.join(",") });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  return (
    <div className="filters mb-4">
      <div className="row">
        {/* Filtro de adm_channel_id */}
        <div className="col-md-3 mb-2">
          <select
            name="adm_channel_id"
            className="form-control"
            value={filters.adm_channel_id || ""}
            onChange={handleFilterChange}
          >
            <option value="">Selecione um Canal ADM</option>
            {admChannels.map((channel) => (
              <option key={channel._id} value={channel._id}>
                {channel.channel_name_presentation}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de channel_ids com múltipla seleção */}
        <div className="col-md-3 mb-2">
          <select
            name="channel_ids"
            className="form-control"
            multiple
            value={filters.channel_ids?.split(",") || []}
            onChange={handleFilterChange}
          >
            {channels.map((channel) => (
              <option key={channel._id} value={channel._id}>
                {channel.channel_name_presentation}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de published_after */}
        <div className="col-md-3 mb-2">
          <input
            type="date"
            name="published_after"
            className="form-control"
            value={filters.published_after || ""}
            onChange={handleFilterChange}
          />
        </div>

        {/* Filtro de published_before */}
        <div className="col-md-3 mb-2">
          <input
            type="date"
            name="published_before"
            className="form-control"
            value={filters.published_before || ""}
            onChange={handleFilterChange}
          />
        </div>
        {/* Filtro por targetLanguage */}
        <div className="col-md-3 mb-2">
          <select
            name="targetLanguage"
            className="form-control"
            value={filters.targetLanguage || ""}
            onChange={handleFilterChange}
          >
            <option value="">Selecione um Idioma</option>
            {Object.entries(languageMap).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Outros filtros dinâmicos */}
        {Object.keys(filters).map(
          (filterKey) =>
            filterKey !== "adm_channel_id" &&
            filterKey !== "channel_ids" &&
            filterKey !== "published_after" &&
            filterKey !== "published_before" && (
              <div className="col-md-3 mb-2" key={filterKey}>
                <input
                  type="text"
                  name={filterKey}
                  className="form-control"
                  placeholder={`Filtrar por ${filterKey}`}
                  value={filters[filterKey] || ""}
                  onChange={handleFilterChange}
                />
              </div>
            )
        )}

        {/* Botão de aplicar filtros */}
        <div className="col-md-12">
          <button className="btn btn-primary w-100" onClick={onApplyFilters}>
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Indicadores de carregamento */}
      {(loadingAdm || loadingChannels) && (
        <div className="text-center">Carregando filtros...</div>
      )}
    </div>
  );
};

export default VideoFiltersComponent;
