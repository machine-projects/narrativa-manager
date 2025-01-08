import React, { useState, useEffect } from "react";
import axios from "axios";

const VideoFiltersComponent = ({ filters, setFilters, onApplyFilters }) => {
  const [admChannels, setAdmChannels] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdmChannels = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/adm-channels?limit=50`);
      setAdmChannels(data.data);
    } catch (error) {
      console.error("Erro ao carregar canais administrados:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmChannels();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="filters mb-4">
      <div className="row">
        {Object.keys(filters).map((filterKey) => (
          <div className="col-md-3 mb-2" key={filterKey}>
            {filterKey === "adm_channel_id" ? (
              <select
                name="adm_channel_id"
                className="form-control"
                value={filters.adm_channel_id}
                onChange={handleFilterChange}
              >
                <option value="">Selecione um Canal</option>
                {admChannels.map((channel) => (
                  <option key={channel._id} value={channel._id}>
                    {channel.channel_name_presentation}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name={filterKey}
                className="form-control"
                placeholder={`Filtrar por ${filterKey}`}
                value={filters[filterKey]}
                onChange={handleFilterChange}
              />
            )}
          </div>
        ))}
        <div className="col-md-12">
          <button className="btn btn-primary w-100" onClick={onApplyFilters}>
            Aplicar Filtros
          </button>
        </div>
      </div>
      {loading && <div className="text-center">Carregando canais...</div>}
    </div>
  );
};

export default VideoFiltersComponent;
