
import React, { useState } from "react";

/**
 * IAPromptComponent exibe um roteiro de prompts para IA e permite copiar o conteúdo
 * de forma independente para cada prompt.
 */
export default function IAPromptComponent() {
  // Definindo os textos dos prompts (podem ser personalizados)
  const promptTextDefault = `IDENTIDADE e PROPÓSITO
Você é um tradutor de textos para português, especialista em limpar textos quebrados e mal formatados, por exemplo: quebras de linha em lugares estranhos, etc. Além disso, você possui a capacidade de adicionar pontuação apropriada para melhorar a legibilidade e a clareza.
Etapas - Leia o documento inteiro e entenda-o completamente. - Remova quaisquer quebras de linha estranhas que interrompam a formatação. - NÃO altere nenhum conteúdo ou ortografia. - Analise o texto, traduza e identifique áreas onde a pontuação está faltando ou incorreta. - Insira sinais de pontuação apropriados (vírgulas, pontos, pontos de interrogação, etc.) para melhorar a estrutura e o fluxo da frase.
INSTRUÇÕES DE SAÍDA - Produza o texto completo, em uma linguagem moderna, formatado corretamente, com a pontuação correta. - Não produza avisos ou notas — apenas as seções solicitadas.
ENTRADA:`;

  const promptTextDefaultMerge = `IDENTIDADE e PROPÓSITO Você é um roteirista de textos focado no youtube, especialista em fazer merge de textos, por exemplo: pegar várias referências de textos e transformar em um só. Além disso, você possui a capacidade de adicionar elementos focado em interação com público. Etapas - Leia o documento inteiro e entenda-o completamente. -faça o merge do máximo de elementos dos textos. - Analise o texto, traduza e identifique áreas onde a pontuação está faltando ou incorreta. - Insira sinais de pontuação apropriados (vírgulas, pontos, pontos de interrogação, etc.) para melhorar a estrutura e o fluxo da frase. INSTRUÇÕES DE SAÍDA - Produza o texto completo, em uma linguagem moderna, formatado corretamente, com a pontuação correta. - Não produza avisos ou notas — apenas as seções solicitadas. ENTRADA:`;

  const promptTextIntroducao = `Crie uma breve introdução chamativa sobre o conteúdo e depois faça uma chamada para o canal do youtube NOME DO CANAL`;
  const promptTextFechamento = `depois dessa parte :
PARTE FINAL DO TEXTO
faça um fechamento`;
  const promptTextTitulos = `Me de opções de titulos chamativos , Clickbait`;

  // Estados de cópia individual para cada prompt
  const [copiedDefault, setCopiedDefault] = useState(false);
  const [copiedIntroducao, setCopiedIntroducao] = useState(false);
  const [copiedMerge, setCopiedMerge] = useState(false);
  const [copiedFechamento, setCopiedFechamento] = useState(false);
  const [copiedTitulos, setCopiedTitulos] = useState(false);

  // Estado para controle de collapse da seção "Tradução e Merge da Legenda"
  const [isMergeCollapsed, setIsMergeCollapsed] = useState(true);

  const handleCopy = async (text, setCopied) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // Reseta o estado após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar o prompt:", err);
    }
  };

  return (
    <div className="p-4 border rounded-md space-y-6">
      <h3 className="text-xl font-semibold mb-4">Roteiro de Prompts para IA</h3>

      <div className="space-y-2">
        <h4 className="text-lg font-semibold">Tradução da Legenda</h4>
        <pre className="p-3 bg-gray-100 rounded overflow-x-auto">
          <code style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
            {promptTextDefault}
          </code>
        </pre>
        <button
          onClick={() => handleCopy(promptTextDefault, setCopiedDefault)}
          className="btn btn-outline-primary"
        >
          {copiedDefault ? "Copiado!" : "Copiar Prompt"}
        </button>
      </div>

      <div className="space-y-2">
        <h4 className="text-lg font-semibold flex items-center justify-between">
          Tradução e Merge da Legenda 
          <button
            onClick={() => setIsMergeCollapsed(!isMergeCollapsed)}
            className="btn btn-outline-secondary"
          >
            {isMergeCollapsed ? "Mostrar" : "Ocultar"}
            
          </button>
        </h4>
        {!isMergeCollapsed && (
          <>
            <pre className="p-3 bg-gray-100 rounded overflow-x-auto">
              <code style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                {promptTextDefaultMerge}
              </code>
            </pre>
            <button
              onClick={() => handleCopy(promptTextDefaultMerge, setCopiedMerge)}
              className="btn btn-outline-primary"
            >
              {copiedMerge ? "Copiado!" : "Copiar Prompt"}
            </button>
          </>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="text-lg font-semibold">Introdução e Chamada para o Canal</h4>
        <pre className="p-3 bg-gray-100 rounded overflow-x-auto">
          <code style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
            {promptTextIntroducao}
          </code>
        </pre>
        <button
          onClick={() => handleCopy(promptTextIntroducao, setCopiedIntroducao)}
          className="btn btn-outline-primary"
        >
          {copiedIntroducao ? "Copiado!" : "Copiar Prompt"}
        </button>
      </div>

      <div className="space-y-2">
        <h4 className="text-lg font-semibold">Fechamento</h4>
        <pre className="p-3 bg-gray-100 rounded overflow-x-auto">
          <code style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
            {promptTextFechamento}
          </code>
        </pre>
        <button
          onClick={() => handleCopy(promptTextFechamento, setCopiedFechamento)}
          className="btn btn-outline-primary"
        >
          {copiedFechamento ? "Copiado!" : "Copiar Prompt"}
        </button>
      </div>
     
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">Titulos</h4>
        <pre className="p-3 bg-gray-100 rounded overflow-x-auto">
          <code style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
            {promptTextTitulos}
          </code>
        </pre>
        <button
          onClick={() => handleCopy(promptTextTitulos, setCopiedTitulos)}
          className="btn btn-outline-primary"
        >
          {copiedTitulos ? "Copiado!" : "Copiar Prompt"}
        </button>
      </div>
    </div>
  );
}
