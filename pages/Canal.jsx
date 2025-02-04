import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import NavBarComponent from "../components/NavBarComponent";

const Canal = () => {
  const searchParams = useSearchParams();
  const channelId = searchParams.get("channelId");
  const [channelData, setChannelData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [adminChannels, setAdminChannels] = useState([]);

  useEffect(() => {
    if (channelId) {
      fetchChannelData(channelId);
      fetchAdminChannels();
    }
  }, [channelId]);

  const fetchChannelData = async (id) => {
    try {
      const response = await axios.get(`/api/channels?channelId=${id}`);
      setChannelData(response.data.data);
      setFormData(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar canal:", error);
    }
  };

  const fetchAdminChannels = async () => {
    try {
      const response = await axios.get(`/api/adm-channels?limit=50`);
      setAdminChannels(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar canais administrativos:", error);
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete("/api/channels", { data: { channelId } });
      alert("Canal deletado com sucesso!");
      setIsDeleting(false);
      window.location.href = "/Canais";
    } catch (error) {
      console.error("Erro ao deletar canal:", error);
      alert("Erro ao deletar canal.");
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/channels", { data: formData });
      alert("Canal atualizado com sucesso!");
      setIsEditing(false);
      fetchChannelData(channelId);
    } catch (error) {
      console.error("Erro ao atualizar canal:", error);
      alert("Erro ao atualizar canal.");
    }
  };

  if (!channelData) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <NavBarComponent active="canais" />
      <div className="container mt-4">
        <h2 className="text-primary">Detalhes do Canal</h2>
        <img
          src={channelData.image}
          alt={channelData.channel_name_presentation}
          width={120}
          className="rounded mb-3 border border-secondary"
        />
        <p><strong>Nome:</strong> {channelData.channel_name_presentation}</p>
        <p><strong>Idioma:</strong> {channelData.language}</p>
        <p><strong>Plataformas:</strong> {channelData.type_platforms.join(", ")}</p>
        <p><strong>Descrição:</strong> {channelData.description}</p>
        <p><strong>Alvos:</strong> {channelData.targets.join(", ")}</p>
        <p><strong>Seguro para famílias:</strong> {channelData.isFamilySafe ? "Sim" : "Não"}</p>
        <p><strong>URL:</strong> <a href={channelData.vanityChannelUrl} target="_blank" rel="noopener noreferrer">{channelData.vanityChannelUrl}</a></p>
        <h3>Administradores</h3>
        <ul>
          {channelData.adm_channels.map((adm) => (
            <li key={adm._id}>{adm.channel_name_presentation}</li>
          ))}
        </ul>
        <button className="btn btn-primary mt-3" onClick={() => setIsEditing(true)}>Editar</button>
        <button className="btn btn-danger mt-3 ms-2" onClick={() => setIsDeleting(true)}>Deletar</button>
        {isEditing && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar Canal</h5>
                  <button type="button" className="close" onClick={() => setIsEditing(false)}>&times;</button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Nome do Canal</label>
                      <input type="text" className="form-control" name="channel_name_presentation" value={formData.channel_name_presentation || ""} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Idioma</label>
                      <input type="text" className="form-control" name="language" value={formData.language || ""} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Target Idioma</label>
                      <input type="text" className="form-control" name="targetLanguage" value={formData.targetLanguage || ""} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Plataformas</label>
                      <input type="text" className="form-control" name="type_platforms" value={formData.type_platforms.join(", ") || ""} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descrição</label>
                      <textarea className="form-control" name="description" value={formData.description || ""} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Alvos</label>
                      <input type="text" className="form-control" name="targets" value={formData.targets.join(", ") || ""} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">URL</label>
                      <input type="text" className="form-control" name="vanityChannelUrl" value={formData.vanityChannelUrl || ""} onChange={handleInputChange} />
                    </div>
                    <button type="submit" className="btn btn-success">Salvar Alterações</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsEditing(false)}>Cancelar</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {isDeleting && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar Exclusão</h5>
                  <button type="button" className="close" onClick={() => setIsDeleting(false)}>&times;</button>
                </div>
                <div className="modal-body">
                  <p>Tem certeza que deseja deletar este canal?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-danger" onClick={handleDelete}>Deletar</button>
                  <button className="btn btn-secondary" onClick={() => setIsDeleting(false)}>Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Canal;