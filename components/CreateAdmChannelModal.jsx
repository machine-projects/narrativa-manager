import React, { useState } from 'react';
import axios from 'axios';
import LanguageSelect from './old/LanguageSelect';

const CreateAdmChannelModal = ({ onSuccess }) => {
    const [channelNamePresentation, setChannelNamePresentation] = useState('');
    const [channels, setChannels] = useState([
        {
            languageTarget: '', // Idioma alvo
            language: '',
            platforms: {
                youtube: { enable: false, url: '' },
                tiktok: { enable: false, url: '' },
                instagram: { enable: false, url: '' },
                kwai: { enable: false, url: '' },
            },
        },
    ]);
    const [description, setDescription] = useState('');
    const [targets, setTargets] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const languageMap = {
        "pt": "Português",
        "en": "Inglês",
        "es": "Espanhol",
        "af": "Africâner",
        "am": "Amárico",
        "ar": "Árabe",
        "az": "Azeri",
        "be": "Bielorrusso",
        "bg": "Búlgaro",
        "bn": "Bengali",
        "bs": "Bósnio",
        "ca": "Catalão",
        "ceb": "Cebuano",
        "co": "Corso",
        "cs": "Tcheco",
        "cy": "Galês",
        "da": "Dinamarquês",
        "de": "Alemão",
        "el": "Grego",
        "eo": "Esperanto",
        "et": "Estoniano",
        "eu": "Basco",
        "fa": "Persa",
        "fi": "Finlandês",
        "fr": "Francês",
        "fy": "Frísio",
        "ga": "Irlandês",
        "gd": "Gaélico Escocês",
        "gl": "Galego",
        "gu": "Guzerate",
        "ha": "Hauçá",
        "haw": "Havaiano",
        "he": "Hebraico",
        "hi": "Hindi",
        "hmn": "Hmong",
        "hr": "Croata",
        "ht": "Crioulo Haitiano",
        "hu": "Húngaro",
        "hy": "Armênio",
        "id": "Indonésio",
        "ig": "Igbo",
        "is": "Islandês",
        "it": "Italiano",
        "ja": "Japonês",
        "jw": "Javanês",
        "ka": "Georgiano",
        "kk": "Cazaque",
        "km": "Khmer",
        "kn": "Canarim",
        "ko": "Coreano",
        "ku": "Curdo",
        "ky": "Quirguiz",
        "la": "Latim",
        "lb": "Luxemburguês",
        "lo": "Lao",
        "lt": "Lituano",
        "lv": "Letão",
        "mg": "Malgaxe",
        "mi": "Maori",
        "mk": "Macedônio",
        "ml": "Malaiala",
        "mn": "Mongol",
        "mr": "Marata",
        "ms": "Malaio",
        "mt": "Maltês",
        "my": "Birmanês",
        "ne": "Nepalês",
        "nl": "Holandês",
        "no": "Norueguês",
        "ny": "Nianja",
        "or": "Oriá",
        "pa": "Punjabi",
        "pl": "Polonês",
        "ps": "Pachto",
        "ro": "Romeno",
        "ru": "Russo",
        "rw": "Kinyarwanda",
        "sd": "Sindi",
        "si": "Cingalês",
        "sk": "Eslovaco",
        "sl": "Esloveno",
        "sm": "Samoano",
        "sn": "Shona",
        "so": "Somali",
        "sq": "Albanês",
        "sr": "Sérvio",
        "st": "Soto do Sul",
        "su": "Sundanês",
        "sv": "Sueco",
        "sw": "Suaíli",
        "ta": "Tâmil",
        "te": "Telugu",
        "tg": "Tadjique",
        "th": "Tailandês",
        "tk": "Turcomeno",
        "tl": "Tagalo",
        "tr": "Turco",
        "tt": "Tártaro",
        "ug": "Uigur",
        "uk": "Ucraniano",
        "ur": "Urdu",
        "uz": "Uzbeque",
        "vi": "Vietnamita",
        "xh": "Xhosa",
        "yi": "Iídiche",
        "yo": "Iorubá",
        "zh": "Chinês (Simplificado)",
        "zh-TW": "Chinês (Tradicional)",
        "zu": "Zulu"
      }

    const handleAddChannel = () => {
        setChannels([
            ...channels,
            {
                languageTarget: '',
                platforms: {
                    youtube: { enable: false, url: '' },
                    tiktok: { enable: false, url: '' },
                    instagram: { enable: false, url: '' },
                    kwai: { enable: false, url: '' },
                },
            },
        ]);
    };

    const handleRemoveChannel = (index) => {
        const updatedChannels = [...channels];
        updatedChannels.splice(index, 1);
        setChannels(updatedChannels);
    };

    const handleChangeChannel = (index, field, value) => {
        const updatedChannels = [...channels];
        updatedChannels[index][field] = value;
        setChannels(updatedChannels);
    };

    const handleChangePlatform = (index, platform, field, value) => {
        setChannels((prevChannels) => {
            const updatedChannels = [...prevChannels];
            updatedChannels[index].platforms[platform][field] = value;
            return updatedChannels;
        });
    };

    const handleSubmit = async () => {
        if (!channelNamePresentation || channels.some((ch) => !ch.languageTarget)) {
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
            const response = await axios.post('/api/adm-channels', payload);
            alert('Canal cadastrado com sucesso!');
            setChannelNamePresentation('');
            setChannels([
                {
                    languageTarget: '',
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
            if (onSuccess) onSuccess();
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
                            <label className="form-label">Marcadores (separados por vírgula)</label>
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
                                <div className="card-body">
                                <LanguageSelect
                            label="Idioma Alvo"
                            value={channel.languageTarget}
                            onChange={(value) =>
                                handleChangeChannel(index, 'languageTarget', value)
                            }
                        />
                                    <h6>Plataformas</h6>
                                    {Object.entries(channel.platforms).map(([platform, config]) => (
                                        <div key={platform} className="mb-3">
                                            <label className="form-label">{platform.toUpperCase()}</label>
                                            <select
                                                className="form-select"
                                                value={config.enable ? 'true' : 'false'}
                                                onChange={(e) =>
                                                    handleChangePlatform(
                                                        index,
                                                        platform,
                                                        'enable',
                                                        e.target.value === 'true'
                                                    )
                                                }
                                            >
                                                <option value="true">Ativo</option>
                                                <option value="false">Inativo</option>
                                            </select>
                                            <input
                                                type="text"
                                                className="form-control mt-2"
                                                placeholder="URL"
                                                value={config.url}
                                                onChange={(e) =>
                                                    handleChangePlatform(index, platform, 'url', e.target.value)
                                                }
                                                disabled={!config.enable}
                                            />
                                        </div>
                                    ))}
                                </div>
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
