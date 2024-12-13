import React from 'react';
import NavBarComponent from '../components/NavBarComponent';
import CreateChannelModal from '../components/CreateChannelModal';
import axios from 'axios';

const CadastrarCanal = () => {
    const [channels, setChannels] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [paginateList, setPaginateLists] = React.useState({
        first: {number: 0, isActive: false},
        second: {number: 0, isActive: false},
        last: {number: 0, isActive: false}
    });

    const managePagination = () => {
        const isTheFirstPage = currentPage == 1;
        const isTheLastPage = currentPage == totalPages;
        console.log('currentPage', currentPage);
        console.log('totalPages', totalPages);
        
        if (isTheFirstPage) {
          console.log('caiu aq 1');
            setPaginateLists({
                first: {number: currentPage, isActive: true},
                second: {number: currentPage + 1, isActive: false},
                last: {number: currentPage + 2, isActive: false}
            });
        }

        if (isTheLastPage) {
          console.log('caiu aq 2');
            setPaginateLists({
                first: {number: currentPage - 2, isActive: false},
                second: {number: currentPage - 1, isActive: false},
                last: {number: currentPage, isActive: true}
            });
        }

        if (!isTheFirstPage && !isTheLastPage) {
          console.log('caiu aq 3');
          
            setPaginateLists({
                first: {number: currentPage - 1, isActive: false},
                second: {number: currentPage, isActive: true},
                last: {number: currentPage + 1, isActive: false}
            });
            
          }
          console.log(paginateList);
    };

    const listChannels = async (page) => {
      console.log('chamouuuuuuu', page);
      
        const request = await axios.get(`/api/channels?page=${page}&limit=2`);
        setChannels(request.data.data);

        setCurrentPage(Number(request.data.page));
        setTotalPages(Number(request.data.totalPages));
        managePagination();
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

                <nav aria-label="...">
                    <ul className="pagination d-flex justify-content-center">
                        <li className="page-item disabled">
                            <a className="page-link">Anterior</a>
                        </li>
                        <li className={`page-item ` + (paginateList.first.isActive ? 'active' : '')} aria-current="page">
                            <a className="page-link" onClick={() => listChannels(paginateList.first.number)}>
                                {paginateList.first.number}
                            </a>
                        </li>
                        <li className={`page-item ` + (paginateList.second.isActive ? 'active' : '')} aria-current="page">
                            <a className="page-link" onClick={() => listChannels(paginateList.second.number)}>
                                {paginateList.second.number}
                            </a>
                        </li>
                        <li className={`page-item ` + (paginateList.last.isActive ? 'active' : '')} aria-current="page">
                            <a className="page-link" onClick={() => listChannels(paginateList.last.number)}>
                                {paginateList.last.number}
                            </a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">
                                Proximo
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default CadastrarCanal;
