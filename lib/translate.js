const {Translate} = require('@google-cloud/translate').v2;




const API_KEY = process.env.TRANSLATE_API_KEY ;

// Inicialize o cliente com a API Key
const translate = new Translate({ key: API_KEY });

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


/**
 * Mapeia códigos de idioma para nomes em português.
 * @param {string} code - Código do idioma (ex: "en", "es", "pt").
 * @returns {string} - Nome do idioma em português ou "Idioma desconhecido" se não for encontrado.
 */
export const targetLanguageToPortuguese = (code) => {
  const languageMap = {
    en: "Inglês",
    es: "Espanhol",
    pt: "Português",
    fr: "Francês",
    de: "Alemão",
    it: "Italiano",
    ja: "Japonês",
    ko: "Coreano",
    zh: "Chinês (Simplificado)",
    zh_TW: "Chinês (Tradicional)",
    ru: "Russo",
    ar: "Árabe",
    hi: "Hindi",
    nl: "Holandês",
    sv: "Sueco",
    no: "Norueguês",
    da: "Dinamarquês",
    fi: "Finlandês",
    pl: "Polonês",
    tr: "Turco",
    el: "Grego",
    cs: "Tcheco",
    ro: "Romeno",
    hu: "Húngaro",
    he: "Hebraico",
    id: "Indonésio",
    th: "Tailandês",
    vi: "Vietnamita",
  };

  return languageMap[code] || "Idioma desconhecido";
};

/**
 * Converte nome do idioma em português para código.
 * @param {string} language - Nome do idioma em português.
 * @returns {string} - Código do idioma ou "Código desconhecido".
 */
export const portugueseToTargetLanguage = (language) => {
  const languageMap = {
    en: "Inglês",
    es: "Espanhol",
    pt: "Português",
    fr: "Francês",
    de: "Alemão",
    it: "Italiano",
    ja: "Japonês",
    ko: "Coreano",
    zh: "Chinês (Simplificado)",
    zh_TW: "Chinês (Tradicional)",
    ru: "Russo",
    ar: "Árabe",
    hi: "Hindi",
    nl: "Holandês",
    sv: "Sueco",
    no: "Norueguês",
    da: "Dinamarquês",
    fi: "Finlandês",
    pl: "Polonês",
    tr: "Turco",
    el: "Grego",
    cs: "Tcheco",
    ro: "Romeno",
    hu: "Húngaro",
    he: "Hebraico",
    id: "Indonésio",
    th: "Tailandês",
    vi: "Vietnamita",
  };

  const invertedMap = Object.entries(languageMap).reduce(
    (acc, [key, value]) => {
      acc[value.toLowerCase()] = key;
      return acc;
    },
    {}
  );

  return invertedMap[language.toLowerCase()] || "Código desconhecido";
};
