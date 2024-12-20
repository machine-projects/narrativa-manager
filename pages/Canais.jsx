import React from 'react';
import NavBarComponent from '../components/NavBarComponent';
import CreateChannelModal from '../components/CreateChannelModal';
import PaginateComponent from 'components/PaginateComponent';
import { ChannelService } from 'services/ChannelService';

const CadastrarCanal = () => {
    const [channels, setChannels] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [itemsLimit] = React.useState(10);

    const listChannels = async (page) => {
        ChannelService.listChannels(page, itemsLimit).then((data) => {
            setChannels(data.data);
            setCurrentPage(Number(data.page));
            setTotalPages(Number(data.totalPages));
        });
    };

    const formatDate = (date) => {
        const dateObject = new Date(date);
        return dateObject.toLocaleDateString('pt-BR');
    };

    React.useEffect(() => {
        listChannels(1);
    }, []);

    return (
        <div>
            <CreateChannelModal />
            <NavBarComponent active="canais" />
            <div className="container">
                <div className="d-flex justify-content-between mt-3">
                    <h2>Cadastrar Canal</h2>
                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Cadastrar Novo
                    </button>
                </div>

                <div className="row mt-4">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Nome do canal</th>
                                <th scope="col">Idioma</th>
                                <th scope="col">Canal Administrador</th>
                                <th scope="col">Data de criação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {channels.map((channel) => (
                                <tr key={channel._id}>
                                    <td>{channel.channel_name_presentation}</td>
                                    <td>{channel.language}</td>
                                    <td>{channel.adm_channel_id}</td>
                                    <td>{formatDate(channel.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <PaginateComponent currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => listChannels(page)} />
            </div>
        </div>
    );
};

export default CadastrarCanal;
