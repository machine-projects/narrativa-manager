import React, { useState, useEffect } from "react";
import NavBarComponent from "../components/NavBarComponent";
import PaginateComponent from "../components/PaginateComponent";
import axios from "axios";

const IndexSincronize = () => {
  const [data, setData] = useState([]);
  const [channels, setChannels] = useState([]); // Estado para os canais
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsLimit] = useState(100);
  const [filters, setFilters] = useState({
    channel_id: "",
    language: "",
    targetLanguage: "",
    type_platforms: "",
    isFamilySafe: "",
    targets: "",
    createdAfter: "",
    createdBefore: "",
    videos_id: "",
  });
  const [isFiltersVisible, setIsFiltersVisible] = useState(false); // Controle da visibilidade dos filtros
  const [syncParams, setSyncParams] = useState({
    channels_ids: [],
    num_syncronize: 50,
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const listSyncronize = async (page) => {
    try {
      const response = await axios.get("/api/videos/syncronize", {
        params: {
          ...filters,
          page,
          limit: itemsLimit,
        },
      });
      setData(response.data.data || []);
      setCurrentPage(Number(response.data.currentPage));
      setTotalPages(Number(response.data.totalPages));
    } catch (error) {
      console.error("Erro ao buscar dados de sincronização:", error);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await axios.get("/api/channels");
      const channelData = response.data.data || [];
      setChannels(channelData);
      setSyncParams((prev) => ({
        ...prev,
        channels_ids: channelData.map((channel) => channel.channelId),
      })); // Define todos os canais como selecionados por padrão
    } catch (error) {
      console.error("Erro ao buscar canais:", error);
    }
  };

  const handleSynchronization = async () => {
    try {
      const syncPayload = {
        ...syncParams,
        startDate: new Date(syncParams.startDate).toISOString(),
        endDate: new Date(syncParams.endDate).toISOString(),
      };
  
      console.log("Payload enviado:", syncPayload); // Para depuração
      const response = await axios.post("/api/videos/syncronize", syncPayload);
      alert("Sincronização realizada com sucesso!");
      listSyncronize(1);
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      alert("Erro ao sincronizar os dados.");
    }
  };
  

  const formatDate = (date) => {
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString("pt-BR");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSyncParamChange = (e) => {
    const { name, value } = e.target;
    setSyncParams((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchChannels();
    listSyncronize(1);
  }, [filters]);

  return (
    <div>
      <NavBarComponent active="sincronize" />
      <div className="container">
        <h2>Sincronização de Dados</h2>
        <div className="row mb-4">
          <div className="col-12">
            <h5>Menu de Sincronização</h5>
            <div className="row g-2">
              <div className="col-md-4">
                <label htmlFor="channels_ids" className="form-label">
                  Canais
                </label>
                <select
                  id="channels_ids"
                  name="channels_ids"
                  className="form-control"
                  multiple
                  value={syncParams.channels_ids}
                  onChange={(e) =>
                    setSyncParams((prev) => ({
                      ...prev,
                      channels_ids: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      ),
                    }))
                  }
                >
                  {channels.map((channel) => (
                    <option key={channel.channelId} value={channel.channelId}>
                      {channel.channel_name_presentation}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label htmlFor="num_syncronize" className="form-label">
                  Qtd. Sincronizar
                </label>
                <input
                  type="number"
                  id="num_syncronize"
                  name="num_syncronize"
                  className="form-control"
                  placeholder="Qtd. Sincronizar"
                  value={syncParams.num_syncronize}
                  onChange={handleSyncParamChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="startDate" className="form-label">
                  Data Início
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="form-control"
                  value={syncParams.startDate}
                  onChange={handleSyncParamChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="endDate" className="form-label">
                  Data Fim
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="form-control"
                  value={syncParams.endDate}
                  onChange={handleSyncParamChange}
                />
              </div>
              <div className="col-md-12 mt-2">
                <button
                  className="btn btn-success w-100"
                  onClick={handleSynchronization}
                >
                  Iniciar Sincronização
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-link"
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
          >
            {isFiltersVisible ? "Minimizar Filtros" : "Expandir Filtros"}
          </button>
        </div>

        {isFiltersVisible && (
          <div className="row mt-4">
            <div className="col-12 mb-3">
              <h5>Filtros</h5>
              <div className="row g-2">
                <div className="col-md-3">
                  <input
                    type="text"
                    name="channel_id"
                    className="form-control"
                    placeholder="Channel ID"
                    value={filters.channel_id}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    name="language"
                    className="form-control"
                    placeholder="Idioma"
                    value={filters.language}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    name="type_platforms"
                    className="form-control"
                    placeholder="Plataforma"
                    value={filters.type_platforms}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    name="targets"
                    className="form-control"
                    placeholder="Alvos"
                    value={filters.targets}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="date"
                    name="createdAfter"
                    className="form-control"
                    value={filters.createdAfter}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="date"
                    name="createdBefore"
                    className="form-control"
                    value={filters.createdBefore}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    name="videos_id"
                    className="form-control"
                    placeholder="Video ID"
                    value={filters.videos_id}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => listSyncronize(1)}
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Data de sincronização</th>
              <th scope="col">Canais Atualizados</th>
              <th scope="col">Vídeos Atualizados</th>
              <th scope="col">Vídeos Inseridos</th>
            </tr>
          </thead>
          <tbody>
  {data.length > 0 ? (
    data.map((item) => (
      <tr key={item._id}>
        <td>{item.date ? formatDate(item.date) : "Data inválida"}</td>
        <td>
          {Array.isArray(item.channels) ? (
            item.channels.map((channel) => (
              <div key={channel._id}>
                <strong>{channel.channel_name_presentation}</strong> - <small>{channel.channelId}</small>
              </div>
            ))
          ) : (
            <span>Nenhum canal disponível</span>
          )}
        </td>
        <td>
          {Array.isArray(item.videosUpdate) ? item.videosUpdate.length : 0}
        </td>
        <td>
          {Array.isArray(item.videosInsert) && item.videosInsert[0]
            ? Object.keys(item.videosInsert[0]).length
            : 0}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="text-center">
        Nenhum dado encontrado.
      </td>
    </tr>
  )}
</tbody>

        </table>

        <PaginateComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => listSyncronize(page)}
        />
      </div>
    </div>
  );
};

export default IndexSincronize;
