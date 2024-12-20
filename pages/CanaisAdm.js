import React, { useEffect, useState } from 'react';
import NavBarComponent from '../components/NavBarComponent';
import CreateAdmChannelModal from '../components/CreateAdmChannelModal';

import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import PaginateComponent from 'components/PaginateComponent';

const CadastrarAdmCanal = () => {
    const [channels, setChannels] = useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [itemsLimit] = React.useState(10);

    const listChannels = async (page) => {
        try {
            const response = await fetch(`/api/adm-channels?page=${page}&limit=${itemsLimit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar canais');
            }

            const data = await response.json();
            setChannels(data.data);
            setCurrentPage(data.page);
            setTotalPages(data.totalPages);
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
            <NavBarComponent active="canais-adm" />
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
                            <div className="card border-dark mb-3" key={channel._id}>
                                <div className="card-header" id={`heading-${channel._id}`}>
                                    <h5 className="mb-0 d-flex justify-content-between align-items-center">
                                        <button
                                            className="btn btn-link  "
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
                                        <h6>Descrição</h6>
                                        {channel.description}
                                        <h6 className="mt-3">Marcadores</h6>
                                        {channel.targets.map((target, idx) => (
                                            <span key={idx} className="badge bg-secondary me-1">
                                                {target}
                                            </span>
                                        ))}
                                        <h6 className="mt-3">Plataformas</h6>

                                        {channel.channels.map((subChannel, idx) => (
                                            <div key={idx} className="border p-2 mb-2">
                                                <div>
                                             
                                                    {channel.channels.map((subChannel, idx) => (
                                                        <div key={idx} className="border p-2 mb-2">
                                                            <div>
                                                                <div className="card-header">
                                                                    <h5 className="mb-0 d-flex justify-content-between align-items-center">
                                                                        {subChannel.language}
                                                                    </h5>
                                                                </div>
                                                                {Object.entries(subChannel.platforms).map(
                                                                    ([platform, config]) => (
                                                                        <div key={platform} className="container">
                                                                            <div className="mb-2">
                                                                                <strong>
                                                                                    {config.enable
                                                                                        ? platform.toUpperCase() + ':'
                                                                                        : ''}
                                                                                </strong>
                                                                                <br></br>
                                                                                {config.url && (
                                                                                    <a
                                                                                        href={config.url}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="ms-2"
                                                                                    >
                                                                                        {config.url}
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
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

                <PaginateComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => listChannels(page)}
                />
            </div>
        </div>
    );
};

export default CadastrarAdmCanal;
