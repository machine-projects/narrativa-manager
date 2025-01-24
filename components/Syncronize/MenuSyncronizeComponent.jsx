import React, { useState, useEffect } from "react";
import axios from "axios";

const MenuSyncronizeComponent = ({ filters, listSyncronize }) => {
  const [channels, setChannels] = useState([]); // Estado para os canais
  const [loading, setLoading] = useState(false);

  const initialSyncParams = {
    channels_ids: [],
    num_syncronize: 50,
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split("T")[0], // 7 dias antes
    endDate: new Date().toISOString().split("T")[0], // Data atual
    visible: "", // Incluímos a opção `visible`
  };

  const [syncParams, setSyncParams] = useState({ ...initialSyncParams });

  const handleSynchronization = async () => {
    try {
      setLoading(true);

      const syncPayload = {
        ...syncParams,
        startDate: syncParams.startDate ? new Date(syncParams.startDate).toISOString() : null,
        endDate: syncParams.endDate ? new Date(syncParams.endDate).toISOString() : null,
        visible: syncParams.visible === "" ? undefined : syncParams.visible, // Envia apenas se definido
      };

      console.log("Payload enviado:", syncPayload); // Para depuração
      const response = await axios.post("/api/videos/syncronize", syncPayload);
      alert("Sincronização realizada com sucesso!");
      listSyncronize(1);
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      alert("Erro ao sincronizar os dados.");
    } finally {
      setLoading(false);
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

  const handleSyncParamChange = (e) => {
    const { name, value } = e.target;
    setSyncParams((prev) => ({
      ...prev,
      [name]: name === "visible" ? (value === "true" ? true : value === "false" ? false : "") : value, // Trata visibilidade
    }));
  };

  const handleClearFilters = () => {
    setSyncParams({
      ...syncParams,
      channels_ids: [],
      num_syncronize: "",
      startDate: null,
      endDate: null,
      visible: "",
    });
  };

  useEffect(() => {
    fetchChannels();
  }, [filters]);

  return (
    <div className="row mb-4">
      <div className="col-12">
        <h5>Menu de Sincronização</h5>
        <div className="row g-3">
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
                  channels_ids: Array.from(e.target.selectedOptions, (option) => option.value),
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
              value={syncParams.startDate || ""}
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
              value={syncParams.endDate || ""}
              onChange={handleSyncParamChange}
            />
          </div>

          {/* Filtro de Visible */}
          <div className="col-md-4">
            <label htmlFor="visible" className="form-label">
              Visibilidade
            </label>
            <select
              id="visible"
              name="visible"
              className="form-control"
              value={syncParams.visible === true ? "true" : syncParams.visible === false ? "false" : ""}
              onChange={handleSyncParamChange}
            >
              <option value="">Todos</option>
              <option value="true">Visível</option>
              <option value="false">Oculto</option>
            </select>
          </div>

          {/* Botões de Sincronizar e Limpar Filtros */}
          <div className="col-md-12 d-flex justify-content-between mt-3">
           
            <button
              className="btn btn-success flex-grow-1 me-2 col-8"
              onClick={handleSynchronization}
              disabled={loading}
              style={{ fontWeight: "bold" }}
            >
              {loading ? "Sincronizando..." : "Iniciar Sincronização"}
            </button>
            <button
              className="btn btn-secondary flex-grow-1 col"
              onClick={handleClearFilters}
              disabled={loading}
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSyncronizeComponent;
