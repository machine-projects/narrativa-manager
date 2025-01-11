let translate;

if (typeof window === "undefined") {
  const { Translate } = require("@google-cloud/translate").v2;

  const API_KEY = process.env.TRANSLATE_API_KEY;

  // Inicialize o cliente com a API Key apenas no servidor
  translate = new Translate({ key: API_KEY });
}


// const translate = new Translate({projectId});
/**
 * Tradução de texto de uma língua específica para Português Brasileiro.
 * @param {string} sourceLanguage - Código da língua do texto original (ex: "en", "es").
 * @param {string} text - Texto a ser traduzido.
 * @returns {Promise<string>} - Retorna o texto traduzido para Português Brasileiro.
 */
export const translateToPortuguese = async (sourceLanguage, text) => {
  console.log(
    `Traduzindo texto de "${sourceLanguage}" para "pt-BR": "${text}"`
  );

  try {
    if (!sourceLanguage || !text) {
      throw new Error("Língua original e texto são obrigatórios.");
    }

    // Faz a tradução para Português Brasileiro
    const [translation] = await translate.translate(text, "pt-BR");

    console.log(`Texto traduzido: "${translation}"`);
    return translation;
  } catch (error) {
    console.error("Erro ao traduzir o texto:", error.message);

    // Verifica se o erro é relacionado à cota excedida
    if (error.code === 403) {
      throw new Error("Cota gratuita do Google Translate API excedida.");
    }

    throw new Error(`Não foi possível traduzir o texto. ${error.message}`);
  }
};

export const languageMap = {
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
  "en": "Inglês",
  "eo": "Esperanto",
  "es": "Espanhol",
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
  "pt": "Português",
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


/**
 * Mapeia códigos de idioma para nomes em português.
 * @param {string} code - Código do idioma (ex: "en", "es", "pt").
 * @returns {string} - Nome do idioma em português ou "Idioma desconhecido" se não for encontrado.
 */
export const targetLanguageToPortuguese = (code) => {
 

  return languageMap[code] || "Idioma desconhecido";
};

/**
 * Converte nome do idioma em português para código.
 * @param {string} language - Nome do idioma em português.
 * @returns {string} - Código do idioma ou "Código desconhecido".
 */
export const portugueseToTargetLanguage = (language) => {
  
  const invertedMap = Object.entries(languageMap).reduce(
    (acc, [key, value]) => {
      acc[value.toLowerCase()] = key;
      return acc;
    },
    {}
  );

  return invertedMap[language.toLowerCase()] || "Código desconhecido";
};


/**
 * Cria um mapeamento entre os idiomas do Google Translate e os idiomas usados na API de legendas.
 * @returns {Object} - Dicionário com os códigos do Google Translate como chave e os códigos da API de legendas como valores.
 */
export const mapLanguagesToSubtitleAPI = () => {
  const googleToSubtitleMap = Object.keys(languageMap).reduce((map, key) => {
    map[key] = key; 
    return map;
  }, {});

  googleToSubtitleMap["he"] = "iw"; // Hebraico
  googleToSubtitleMap["zh"] = "zh-Hans"; // Chinês Simplificado
  googleToSubtitleMap["zh-TW"] = "zh-Hant"; // Chinês Tradicional


  return googleToSubtitleMap;
};


/**
 * Monta a URL para download de legendas de um vídeo do YouTube.
 * @param {string} videoUrl - URL completa do vídeo do YouTube.
 * @param {string} language - Código de idioma do Google Translate.
 * @returns {string} - URL para download da legenda.
 */
export const buildSubtitleDownloadUrl = (videoUrl, language) => {
  const googleToSubtitleMap = mapLanguagesToSubtitleAPI();

  const videoIdMatch = videoUrl.match(/v=([\w-]+)/);
  if (!videoIdMatch) {
    throw new Error("URL do vídeo inválida ou ID não encontrado.");
  }

  const videoId = videoIdMatch[1];
  const subtitleLanguage = googleToSubtitleMap[language] || language;
  
  return `https://getsubs.cc/get_y.php?i=${videoId}&format=txt&hl=${subtitleLanguage}&a=auto`;
};

