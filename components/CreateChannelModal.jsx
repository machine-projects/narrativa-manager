import React, { useState, useRef } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import './CreateChannelModal.css';
import { ChannelService } from 'services/ChannelService';

const CreateChannelModal = ({ onChannelCreate }) => {
    const closeModalButtonRef = useRef(null);

    const [channelName, setChannelName] = useState('');
    const [idChannel, setIdChannel] = useState('');
    const [channelLanguage, setChannelLanguage] = useState('');
    const [channelsType, setChannelsType] = useState([]);
    const [tags, setTags] = useState([]);

    const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = (tag) => {
        setTags([...tags, tag]);
    };

    const handleSelectChange = (e) => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setChannelsType(values);
    };

    const clearForm = () => {
        setChannelName('');
        setIdChannel('');
        setChannelLanguage('');
        setChannelsType([]);
        setTags([]);
        console.log('se pa limpou');
        
    };

    const languageMap = {
        en: 'Inglês',
        es: 'Espanhol',
        pt: 'Português',
        fr: 'Francês',
        de: 'Alemão',
        it: 'Italiano',
        ja: 'Japonês',
        ko: 'Coreano',
        zh: 'Chinês (Simplificado)',
        zh_TW: 'Chinês (Tradicional)',
        ru: 'Russo',
        ar: 'Árabe',
        hi: 'Hindi',
        nl: 'Holandês',
        sv: 'Sueco',
        no: 'Norueguês',
        da: 'Dinamarquês',
        fi: 'Finlandês',
        pl: 'Polonês',
        tr: 'Turco',
        el: 'Grego',
        cs: 'Tcheco',
        ro: 'Romeno',
        hu: 'Húngaro',
        he: 'Hebraico',
        id: 'Indonésio',
        th: 'Tailandês',
        vi: 'Vietnamita'
    };

    const type_platforms = ['Youtube', 'TikTok', 'Twitch', 'Instagram'];

    const createChannel = async () => {
        try {
            const channelCreated = await ChannelService.createChannel({
                custom_name_channel: channelName,
                targetLanguage: channelLanguage,
                type_platforms: channelsType,
                adm_channel_id: idChannel,
                targets: tags.map((e) => e.id)
            });

            if (channelCreated) {
                alert('Canal criado com sucesso!');
                closeModalButtonRef.current.click();
                onChannelCreate(true);
                clearForm();
            }
        } catch (error) {
            alert('Erro: ' + error);
        }
    };

    return (
        <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                            Cadastrar Novo Canal
                        </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="Nome do Canal"
                                onChange={(e) => setChannelName(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="ID do Canal"
                                onChange={(e) => setIdChannel(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                defaultValue=""
                                onChange={(e) => setChannelLanguage(e.target.value)}
                            >
                                <option value="" disabled>
                                    Selecione o idioma do canal
                                </option>
                                {Object.keys(languageMap).map((key) => (
                                    <option key={key} value={key}>
                                        {languageMap[key]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <select className="form-select" multiple onChange={handleSelectChange}>
                                {type_platforms.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <ReactTags
                                tags={tags}
                                handleDelete={handleDelete}
                                handleAddition={handleAddition}
                                inputFieldPosition="top"
                                autocomplete
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            id="closeModalButton"
                            ref={closeModalButtonRef}
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Fechar
                        </button>
                        <button type="button" className="btn btn-primary" onClick={createChannel}>
                            Salvar e Criar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateChannelModal;
