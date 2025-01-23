
import React, { useState, useEffect } from "react";
import axios from "axios";

const MenuSyncronizeComponent = ({

  filters,
  listSyncronize
}) => {
  const [channels, setChannels] = useState([]); // Estado para os canais
  const [loading, setLoading] = useState(false);

  const [syncParams, setSyncParams] = useState({
    channels_ids: [],
    num_syncronize: 50,
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const handleSynchronization = async () => {
    try {
      setLoading(true);
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
      setSyncParams((prev) => ({ ...prev, [name]: value }));
    };
    useEffect(() => {
      fetchChannels();
   
    }, [filters]);
  
  return (
   
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
  disabled={loading}
>
  {loading ? "Sincronizando..." : "Iniciar Sincronização"}
</button>

        </div>
      </div>
    </div>
  </div>

  );
};

export default MenuSyncronizeComponent;
