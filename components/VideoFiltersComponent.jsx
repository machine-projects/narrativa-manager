import React, { useState, useEffect } from "react";
import axios from "axios";
import { languageMap } from "../lib/translate";

const VideoFiltersComponent = ({ filters, setFilters, onApplyFilters, setPage  }) => {
  const [admChannels, setAdmChannels] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loadingAdm, setLoadingAdm] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [targets, setTargets] = useState([]);

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
      const { data } = await axios.get(`/api/channels?limit=1000`);
      setChannels(data.data);
      const allTargets = data.data.flatMap((channel) => channel.targets || []);
      setTargets([...new Set(allTargets)]);
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

  const handleFilterChange = (e) => {
    const { name, value, options } = e.target;
  
    if (name === "channels_ids" || name === "targets") {
      // Tratar seleção múltipla
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFilters({ ...filters, [name]: selectedValues });
    } else if (name === "visible" || name === "applied") {
      // Tratar valores como string corretamente
      if (value === "true" || value === "false") {
        setFilters({ ...filters, [name]: value });
      } else {
        const newFilters = { ...filters };
        delete newFilters[name]; // Remove o filtro se nenhum for selecionado
        setFilters(newFilters);
      }
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };
  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };
  
  const applyFilters = () => {
    setPage(1);
    const appliedFilters = { ...filters };
  
    // Enviar filtros com o campo `visible` tratado como string
    if (appliedFilters.visible === undefined) {
      delete appliedFilters.visible;
    }
    
    onApplyFilters(appliedFilters);
  };


  return (
    <div className="filters mb-4">
      <div className="row">
        {/* Filtro de keywords_in_title_presentation */}
        <div className="col-md-3 mb-2">
          <label htmlFor="keywords_in_title_presentation">Título</label>
          <input
            type="text"
            id="keywords_in_title_presentation"
            name="keywords_in_title_presentation"
            className="form-control"
            placeholder="Buscar por título"
            value={filters.keywords_in_title_presentation || ""}
            onChange={handleFilterChange}
          />
        </div>

        {/* Filtro de adm_channel_id */}
        <div className="col-md-3 mb-2">
          <label htmlFor="adm_channel_id">Canal ADM</label>
          <select
            id="adm_channel_id"
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
          <label htmlFor="channels_ids">Canais</label>
          <select
            id="channels_ids"
            name="channels_ids"
            className="form-control"
            multiple
            value={filters.channels_ids || []}
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
          <label htmlFor="published_after">Publicado após</label>
          <input
            type="date"
            id="published_after"
            name="published_after"
            className="form-control"
            value={filters.published_after || ""}
            onChange={handleFilterChange}
          />
        </div>

        {/* Filtro de published_before */}
        <div className="col-md-3 mb-2">
          <label htmlFor="published_before">Publicado antes</label>
          <input
            type="date"
            id="published_before"
            name="published_before"
            className="form-control"
            value={filters.published_before || ""}
            onChange={handleFilterChange}
          />
        </div>

        {/* Filtro por targetLanguage */}
        <div className="col-md-3 mb-2">
          <label htmlFor="targetLanguage">Idioma</label>
          <select
            id="targetLanguage"
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

        {/* Filtro de Marcadores (Targets) */}
        <div className="col-md-3 mb-2">
          <label htmlFor="targets">Marcadores</label>
          <select
            id="targets"
            name="targets"
            className="form-control"
            multiple
            value={filters.targets || []}
            onChange={handleFilterChange}
          >
            {targets.map((target) => (
              <option key={target} value={target}>
                {target}
              </option>
            ))}
          </select>
        </div>

      {/* Filtro de Visible (true/false) */}
<div className="col-md-3 mb-2">
  <label htmlFor="visible">Visibilidade</label>
  <select
    id="visible"
    name="visible"
    className="form-control"
    value={filters.visible || ""}
    onChange={handleFilterChange}
  >
    <option value="">Todos</option>
    <option value="true">Visível</option>
    <option value="false">Oculto</option>
  </select>
</div>

  {/* Filtro de Applied (true/false) */}
  <div className="col-md-3 mb-2">
          <label htmlFor="applied">Aplicado</label>
          <select
            id="applied"
            name="applied"
            className="form-control"
            value={filters.applied || ""}
            onChange={handleFilterChange}
          >
            <option value="">Todos</option>
            <option value="true">Aplicado</option>
            <option value="false">Não Aplicado</option>
          </select>
        </div>
        <div className="col-md-12 mt-3"></div>
        {/* Botões de aplicar e limpar filtros */}
        <div className="col-md-6 mt-3">
          <button className="btn btn-primary w-100" onClick={applyFilters}>
            Aplicar Filtros
          </button>
        </div>
        <div className="col-md-6 mt-3">
          <button className="btn btn-secondary w-100" onClick={handleClearFilters}>
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Indicadores de carregamento */}
      {(loadingAdm || loadingChannels) && (
        <div className="text-center mt-3">Carregando filtros...</div>
      )}
    </div>
  );
};

export default VideoFiltersComponent;
