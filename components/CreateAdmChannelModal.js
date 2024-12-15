import React, { useState } from 'react';
import axios from 'axios';

const CreateAdmChannelModal = ({ onSuccess }) => {
    const [channelNamePresentation, setChannelNamePresentation] = useState('');
    const [channels, setChannels] = useState([
        {
            language: '',
            targetLanguage: '',
            platforms: {
                youtube: { enable: false, url: '' },
                tiktok: { enable: false, url: '' },
                instagram: { enable: false, url: '' },
                kwai: { enable: false, url: '' },
            },
        },
    ]);

    const [collapsed, setCollapsed] = useState([false]); // Controle de colapsar cards
    const [description, setDescription] = useState('');
    const [targets, setTargets] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddChannel = () => {
        setChannels([
            ...channels,
            {
                language: '',
                targetLanguage: '',
                platforms: {
                    youtube: { enable: false, url: '' },
                    tiktok: { enable: false, url: '' },
                    instagram: { enable: false, url: '' },
                    kwai: { enable: false, url: '' },
                },
            },
        ]);
        setCollapsed([...collapsed, false]); // Adicionar controle de colapsar para o novo canal
    };

    const handleRemoveChannel = (index) => {
        const updatedChannels = [...channels];
        const updatedCollapsed = [...collapsed];
        updatedChannels.splice(index, 1);
        updatedCollapsed.splice(index, 1);
        setChannels(updatedChannels);
        setCollapsed(updatedCollapsed);
    };

    const toggleCollapse = (index) => {
        const updatedCollapsed = [...collapsed];
        updatedCollapsed[index] = !updatedCollapsed[index];
        setCollapsed(updatedCollapsed);
    };

    const handleChangeChannel = (index, field, value) => {
        setChannels((prevChannels) => {
            const updatedChannels = [...prevChannels];

            // Lógica para atualizar valores aninhados
            const keys = field.split('.');
            if (keys.length === 2) {
                const [platform, subField] = keys;
                updatedChannels[index] = {
                    ...updatedChannels[index],
                    platforms: {
                        ...updatedChannels[index].platforms,
                        [platform]: {
                            ...updatedChannels[index].platforms[platform],
                            [subField]: value,
                        },
                    },
                };
            } else {
                updatedChannels[index] = {
                    ...updatedChannels[index],
                    [field]: value,
                };
            }

            return updatedChannels;
        });
    };

    const handleChangePlatform = (index, platform, field, value) => {
        setChannels((prevChannels) => {
            const updatedChannels = [...prevChannels];
            updatedChannels[index].platforms[platform][field] = value; // Atualiza diretamente o valor do campo
            return updatedChannels;
        });
    };





    const handleSubmit = async () => {
        if (!channelNamePresentation || channels.length === 0) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        const payload = {
            channel_name_presentation: channelNamePresentation,
            channels,
            description,
            targets: targets.split(',').map((t) => t.trim()),
        };

        try {
            setIsLoading(true);
            const response = await axios.post('/api/adm-channel', payload);
            alert('Canal cadastrado com sucesso!');
            setChannelNamePresentation('');
            setChannels([
                {
                    language: '',
                    targetLanguage: '',
                    platforms: {
                        youtube: { enable: false, url: '' },
                        tiktok: { enable: false, url: '' },
                        instagram: { enable: false, url: '' },
                        kwai: { enable: false, url: '' },
                    },
                },
            ]);
            setDescription('');
            setTargets('');
            setIsLoading(false);
            setCollapsed([false]); // Resetar estado colapsado
            if (onSuccess) onSuccess(); // Atualiza a lista no componente pai
        } catch (error) {
            console.error('Erro ao cadastrar canal:', error);
            alert('Erro ao cadastrar canal. Verifique os campos e tente novamente.');
            setIsLoading(false);
        }
    };

    return (
        <div
            className="modal fade"
            id="createAdmChannelModal"
            tabIndex="-1"
            aria-labelledby="createAdmChannelModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="createAdmChannelModalLabel">
                            Cadastrar Novo Canal Administrativo
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Nome de Apresentação</label>
                            <input
                                type="text"
                                className="form-control"
                                value={channelNamePresentation}
                                onChange={(e) => setChannelNamePresentation(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Descrição</label>
                            <textarea
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Alvos (separados por vírgula)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={targets}
                                onChange={(e) => setTargets(e.target.value)}
                            />
                        </div>
                        <hr />
                        <h6>Canais</h6>
                        {channels.map((channel, index) => (
                            <div key={index} className="card mb-3">
                                <div
                                    className="card-header d-flex justify-content-between align-items-center"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => toggleCollapse(index)}
                                >
                                    <span>Canal {index + 1}</span>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-secondary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveChannel(index);
                                        }}
                                    >
                                        X
                                    </button>
                                </div>
                                {!collapsed[index] && (
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label">Idioma</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={channel.language}
                                                onChange={(e) =>
                                                    handleChangeChannel(index, 'language', e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Idioma target</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={channel.targetLanguage}
                                                onChange={(e) =>
                                                    handleChangeChannel(index, 'targetLanguage', e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <h6>Plataformas</h6>
                                        {Object.keys(channel.platforms).map((platform) => (
                                            <div className="mb-3" key={platform}>
                                                <label className="form-label">{platform.toUpperCase()}</label>
                                                <div>
                                                    <select
                                                        className="form-select"
                                                        value={channel.platforms[platform].enable ? "ativo" : "inativo"}
                                                        onChange={(e) =>
                                                            handleChangePlatform(
                                                                index,
                                                                platform, // Nome da plataforma
                                                                "enable", // Campo sendo alterado
                                                                e.target.value === "ativo" // Define o valor como true/false
                                                            )
                                                        }
                                                    >
                                                        <option value="ativo">Ativo</option>
                                                        <option value="inativo">Inativo</option>
                                                    </select>
                                                </div>
                                                <input
    type="text"
    className="form-control mt-2"
    placeholder="URL"
    value={channel.platforms[platform].url}
    onChange={(e) =>
        handleChangePlatform(
            index,
            platform, // Nome da plataforma
            "url", // Campo sendo alterado
            e.target.value
        )
    }
    disabled={!channel.platforms[platform].enable} // Campo desativado se "enable" for false
/>
                                            </div>
                                        ))}



                                    </div>
                                )}
                            </div>
                        ))}
                        <button type="button" className="btn btn-secondary" onClick={handleAddChannel}>
                            Adicionar Canal
                        </button>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Fechar
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAdmChannelModal;
