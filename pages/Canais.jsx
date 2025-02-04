import React from "react";
import NavBarComponent from "../components/NavBarComponent";
import CreateChannelModal from "../components/CreateChannelModal";
import PaginateComponent from "components/PaginateComponent";
import { ChannelService } from "services/ChannelService";


const CadastrarCanal = () => {
  const [channels, setChannels] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [itemsLimit] = React.useState(10);
  const [isLoading, setIsLoading] = React.useState(false); // Estado para o modal de carregamento

  const listChannels = async (page) => {
    try {
      const data = await ChannelService.listChannels(page, itemsLimit);
      setChannels(data.data);
      setCurrentPage(Number(data.page));
      setTotalPages(Number(data.totalPages));
    } catch (error) {
      console.error("Erro ao listar canais:", error);
    }
  };

  const formatDate = (date) => {
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString("pt-BR");
  };

  const handleChannelCreate = async (channelData) => {
    try {
      if (!channelData || !channelData.channelId) {
        throw new Error("Os dados do canal criado estão inválidos.");
      }

      const newChannelId = channelData.channelId;
      const admChannels = channelData.adm_channels.map((adm) => adm._id);

      // Exibe o modal de carregamento
      setIsLoading(true);

      // Chamar a sincronização com o canal criado
      await handleChannelSynchronization(newChannelId, admChannels);

      // Alerta de sucesso
      alert("Canal cadastrado e sincronizado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar e sincronizar o canal:", error);
      alert("Erro ao cadastrar e sincronizar o canal.");
    } finally {
      // Esconde o modal de carregamento
      setIsLoading(false);
    }
  };

  const handleChannelSynchronization = async (channelId, admChannels) => {
    try {
      const syncPayload = {
        num_syncronize: 50,
        channels_ids: [channelId],
      };
      await ChannelService.syncronizeChannel(syncPayload);

    } catch (error) {
      console.error("Erro ao sincronizar canal:", error);
      throw new Error("Erro durante a sincronização do canal.");
    }
  };

  React.useEffect(() => {
    listChannels(1);
  }, []);

  return (
    <div>
      <CreateChannelModal onChannelCreate={handleChannelCreate} />
      <NavBarComponent active="canais" />
      <div className="container">
        <div className="d-flex justify-content-between mt-3">
          <h2>Cadastrar Canal</h2>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Cadastrar Novo
          </button>
        </div>

        <div className="row mt-4">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Nome do canal</th>
                <th scope="col">Idioma</th>
                <th scope="col">Canal Administrador</th>
                <th scope="col">Data de criação</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((channel) => (
                <tr key={channel._id}>
                  <td style={{ width: "50px" }}>
                    <img
                      src={channel.image}
                      alt="Imagem do canal"
                      width={50}
                      className="rounded"
                    />
                  </td>
                  <td> <a href={"/Canal?channelId="+channel.channelId}>{channel.channel_name_presentation} </a></td>
                  <td>{channel.language}</td>
                  <td>
                    {channel.adm_channels
                      ?.map((adm) => adm.channel_name_presentation)
                      .join(", ") || "N/A"}
                  </td>
                  <td>{formatDate(channel.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginateComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => listChannels(page)}
        />
      </div>

      {/* Modal de carregamento */}
      {isLoading && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-3">Sincronizando canal. Por favor, aguarde...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastrarCanal;
