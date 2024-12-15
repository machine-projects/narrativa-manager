import React, { useEffect, useState } from 'react';
import NavBarComponent from '../components/NavBarComponent';
import CreateAdmChannelModal from '../components/CreateAdmChannelModal';
import axios from 'axios';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const CadastrarAdmCanal = () => {
    const [channels, setChannels] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [expandedChannels, setExpandedChannels] = useState([]);
    const [paginateList, setPaginateLists] = useState({
        first: { number: 1, isActive: false },
        second: { number: 2, isActive: false },
        last: { number: 3, isActive: false }
    });

    const toggleExpandChannel = (id) => {
        setExpandedChannels((prev) =>
            prev.includes(id) ? prev.filter((chId) => chId !== id) : [...prev, id]
        );
    };

    const managePagination = () => {
        const isFirstPage = currentPage === 1;
        const isLastPage = currentPage === totalPages;

        if (isFirstPage) {
            setPaginateLists({
                first: { number: currentPage, isActive: true },
                second: { number: currentPage + 1, isActive: false },
                last: { number: currentPage + 2, isActive: false }
            });
        } else if (isLastPage) {
            setPaginateLists({
                first: { number: currentPage - 2, isActive: false },
                second: { number: currentPage - 1, isActive: false },
                last: { number: currentPage, isActive: true }
            });
        } else {
            setPaginateLists({
                first: { number: currentPage - 1, isActive: false },
                second: { number: currentPage, isActive: true },
                last: { number: currentPage + 1, isActive: false }
            });
        }
    };

    const listChannels = async (page) => {
        try {
            const response = await axios.get(`/api/adm-channels?page=${page}&limit=10`);
            setChannels(response.data.data);
            setCurrentPage(response.data.page);
            setTotalPages(response.data.totalPages);
            managePagination();
        } catch (error) {
            console.error('Erro ao carregar canais:', error);
        }
    };

    const formatDate = (date) => {
        const dateObject = new Date(date);
        return dateObject.toLocaleDateString('pt-BR');
    };

    const refreshChannels = () => {
        listChannels(currentPage);
    };

    useEffect(() => {
        listChannels(1);
    }, []);

    return (
        <div>
            <CreateAdmChannelModal onSuccess={refreshChannels} />
            <NavBarComponent active="canais" />
            <div className="container">
                <div className="d-flex justify-content-between mt-3">
                    <h2>Gerenciar Canais Administrativos</h2>
                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createAdmChannelModal">
                        Cadastrar Novo Canal
                    </button>
                </div>

                <div className="accordion mt-4" id="accordionChannels">
                    {channels.map((channel) => (
                        <div className="card" key={channel._id}>
                            <div className="card-header" id={`heading-${channel._id}`}>
                                <h5 className="mb-0 d-flex justify-content-between align-items-center">
                                    <button
                                        className="btn btn-link"
                                        onClick={() => toggleExpandChannel(channel._id)}
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse-${channel._id}`}
                                        aria-expanded={expandedChannels.includes(channel._id)}
                                        aria-controls={`collapse-${channel._id}`}
                                    >
                                        {channel.channel_name_presentation}
                                    </button>
                                    <button className="btn btn-danger">
                                        <FaTrash />
                                    </button>
                                </h5>
                            </div>

                            <div
                                id={`collapse-${channel._id}`}
                                className={`collapse ${expandedChannels.includes(channel._id) ? 'show' : ''}`}
                                aria-labelledby={`heading-${channel._id}`}
                                data-bs-parent="#accordionChannels"
                            >
                                <div className="card-body">
                                    <h6>Idiomas</h6>
                                    {channel.channels.map((subChannel, idx) => (
                                        <span key={idx} className="badge bg-info me-1">
                                            {subChannel.language}
                                        </span>
                                    ))}
                                    <h6 className="mt-3">Alvos</h6>
                                    {channel.targets.map((target, idx) => (
                                        <span key={idx} className="badge bg-secondary me-1">
                                            {target}
                                        </span>
                                    ))}
                                    <h6 className="mt-3">Plataformas</h6>
                                    {channel.channels.map((subChannel, idx) => (
                                        <div key={idx} className="border p-2 mb-2">
                                            {Object.entries(subChannel.platforms).map(([platform, config]) => (
                                                <div key={platform} className="mb-2">
                                                    <strong>{platform.toUpperCase()}:</strong>
                                                    <select
                                                        className="form-select ms-2"
                                                        value={config.enable ? 'true' : 'false'}
                                                        onChange={(e) => {
                                                            const value = e.target.value === 'true';
                                                            config.enable = value;
                                                        }}
                                                    >
                                                        <option value="true">Ativo</option>
                                                        <option value="false">Inativo</option>
                                                    </select>
                                                    <input
                                                        type="text"
                                                        className="form-control mt-2"
                                                        placeholder="URL"
                                                        value={config.url}
                                                        onChange={(e) => (config.url = e.target.value)}
                                                        disabled={!config.enable}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <nav aria-label="Pagination" className="mt-4">
                    <ul className="pagination d-flex justify-content-center">
                        <li className={`page-item ${paginateList.first.number <= 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => listChannels(paginateList.first.number - 1)}
                            >
                                Anterior
                            </button>
                        </li>
                        <li
                            className={`page-item ${paginateList.first.isActive ? 'active' : ''}`}
                            aria-current="page"
                        >
                            <button
                                className="page-link"
                                onClick={() => listChannels(paginateList.first.number)}
                            >
                                {paginateList.first.number}
                            </button>
                        </li>
                        <li
                            className={`page-item ${paginateList.second.isActive ? 'active' : ''}`}
                            aria-current="page"
                        >
                            <button
                                className="page-link"
                                onClick={() => listChannels(paginateList.second.number)}
                            >
                                {paginateList.second.number}
                            </button>
                        </li>
                        <li
                            className={`page-item ${paginateList.last.isActive ? 'active' : ''}`}
                            aria-current="page"
                        >
                            <button
                                className="page-link"
                                onClick={() => listChannels(paginateList.last.number)}
                            >
                                {paginateList.last.number}
                            </button>
                        </li>
                        <li className={`page-item ${paginateList.last.number >= totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => listChannels(paginateList.last.number + 1)}
                            >
                                Próximo
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default CadastrarAdmCanal;
