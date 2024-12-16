import React, { useEffect, useState } from 'react';
import NavBarComponent from '../components/NavBarComponent';
import CreateAdmChannelModal from '../components/CreateAdmChannelModal';
import axios from 'axios';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const CadastrarAdmCanal = () => {
    const [channels, setChannels] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const listChannels = async (page) => {
        try {
            const response = await axios.get(`/api/adm-channels?page=${page}&limit=5`);
            setChannels(response.data.data);
            setCurrentPage(response.data.page);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Erro ao carregar canais:', error);
        }
    };

    const formatDate = (date) => {
        const dateObject = new Date(date);
        return dateObject.toLocaleDateString('pt-BR');
    };

    useEffect(() => {
        listChannels(1);
    }, []);

    return (
        <div>
            <CreateAdmChannelModal onSuccess={() => listChannels(currentPage)} />
            <NavBarComponent active="canais" />
            <div className="container">
                <div className="d-flex justify-content-between mt-3">
                    <h2>Gerenciar Canais Administrativos</h2>
                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createAdmChannelModal">
                        Cadastrar Novo Canal
                    </button>
                </div>

                <div className="accordion mt-4" id="accordionChannels">
                    {channels.length > 0 ? (
                        channels.map((channel) => (
                            <div className="card" key={channel._id}>
                                <div className="card-header" id={`heading-${channel._id}`}>
                                    <h5 className="mb-0 d-flex justify-content-between align-items-center">
                                        <button
                                            className="btn btn-link"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse-${channel._id}`}
                                            aria-expanded="false"
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
                                    className="collapse"
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
                                        <h6 className="mt-3">Marcadores</h6>
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
                                                            disabled
                                                        >
                                                            <option value="true">Ativo</option>
                                                            <option value="false">Inativo</option>
                                                        </select>
                                                        {config.url && (
                                                            <a
                                                                href={config.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="ms-2"
                                                            >
                                                                Link
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="alert alert-info mt-4" role="alert">
                            Nenhum canal encontrado.
                        </div>
                    )}
                </div>

                <nav aria-label="Pagination" className="mt-4">
                    <ul className="pagination d-flex justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => listChannels(currentPage - 1)}
                            >
                                Anterior
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                            <li
                                key={index}
                                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => listChannels(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => listChannels(currentPage + 1)}
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
