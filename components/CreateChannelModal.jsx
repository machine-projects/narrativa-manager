import React, { useState, useRef, useEffect } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import './CreateChannelModal.css';
import { ChannelService } from 'services/ChannelService';

const CreateChannelModal = ({ onChannelCreate }) => {
    const closeModalButtonRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const [channelName, setChannelName] = useState('');
    const [channelUrl, setChannelUrl] = useState('');
    const [channelLanguage, setChannelLanguage] = useState('');
    const [channelsType, setChannelsType] = useState([]);
    const [tags, setTags] = useState([]);
    const [admChannelsIdList, setAdmChannelsIdList] = useState([]);
    
    const type_platforms = ['Youtube', 'TikTok', 'Twitch', 'Instagram'];
    const [adminChannelsList, setAdminChannelsList] = useState([]);

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

    const handleTagsDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleTagsAddition = (tag) => {
        setTags([...tags, tag]);
    };

    const handleChannelsTypeSelectChange = (e) => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setChannelsType(values);
    };
    const handleAdminChannelsSelectChange = (e) => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setAdmChannelsIdList(values);
    };

    const clearForm = () => {
        setChannelName('');
        setIdChannel('');
        setChannelLanguage('');
        setChannelsType([]);
        setTags([]);
    };

    useEffect(() => {
        getAdminChannels();
    }, []);

    const getAdminChannels = async () => {
        try {
            const channels = await ChannelService.getAdmChannels();
            const channelsList = [];
            channels.forEach((element) => {
                channelsList.push({ name: element.channel_name_presentation, value: element._id });
            });
            setAdminChannelsList(channelsList);
        } catch (e) {
            console.log(e);
        }
    };

    const createChannel = async () => {
        setIsLoading(true);
        try {
            const channelCreated = await ChannelService.createChannel({
                custom_name_channel: channelName,
                channelUrl: channelUrl,
                targetLanguage: channelLanguage,
                type_platforms: channelsType,
                adm_channels: admChannelsIdList.map((e) => e),
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
        } finally {
            setIsLoading(false);
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
                                placeholder="URL do canal"
                                value={channelUrl}
                                onChange={(e) => setChannelUrl(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <select
                                className="form-select"
                                multiple
                                onChange={handleAdminChannelsSelectChange}
                                value={admChannelsIdList}
                            >
                                {adminChannelsList.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            {/* <ReactTags
                                tags={admChannelsIdList}
                                handleDelete={handleAdmChannelsDelete}
                                handleAddition={handleAdmChannelsAddition}
                                inputFieldPosition="top"
                                autocomplete
                                placeholder="Digite o ID do canal administrador e pressione enter"
                            /> */}
                        </div>

                        <div className="mb-3">
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                value={channelLanguage}
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
                            <select
                                className="form-select"
                                multiple
                                onChange={handleChannelsTypeSelectChange}
                                value={channelsType}
                            >
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
                                handleDelete={handleTagsDelete}
                                handleAddition={handleTagsAddition}
                                inputFieldPosition="top"
                                placeholder="Insira uma nova tag e pressione enter"
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
                        <button type="button" className="btn btn-primary" onClick={createChannel} disabled={isLoading}>
                            {isLoading && (
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            )}
                            &nbsp;Salvar e Criar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateChannelModal;
