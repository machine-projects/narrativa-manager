import React, { useState, useEffect } from "react";
import axios from "axios";
import { languageMap } from '../lib/translate';


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
    if (name === "channels_ids") {
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

        {/* Filtro de channels_ids com múltipla seleção */}
        <div className="col-md-3 mb-2">
          <select
            name="channels_ids"
            className="form-control"
            multiple
            value={filters.channels_ids?.split(",") || []}
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
            filterKey !== "channels_ids" &&
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
