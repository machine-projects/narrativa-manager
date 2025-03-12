import React, { useState } from "react";
import AIPrompt from "./IAPromptComponent";

/**
 * VideoAndAnnotationDocument component displays two tabs: one for VIDEO and one for ANOTAÇÕES.
 * 
 * Props:
 * - videoId: string (required) - The video identifier used for both the YouTube embed and to fetch the annotation document.
 *
 * The "Vídeo" tab (active by default) shows the embedded YouTube video.
 * The "Anotações" tab provides a button to create or view the Google Docs annotation document via the backend API.
 * Additionally, the <AIPrompt /> component in the annotation tab starts collapsed.
 */
export default function VideoAndAnnotationDocument({ videoId, embed }) {
  // Default active tab set to "video" so that the video appears initially.
  const [activeTab, setActiveTab] = useState("video"); // "video" or "anotacoes"
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para controle do colapso do componente AIPrompt na aba "anotacoes".
  const [isPromptCollapsed, setIsPromptCollapsed] = useState(true);

  // Function to create or view the Google Docs annotation document.
  const handleCreateOrView = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/google-docs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro desconhecido");
      }

      const data = await response.json();
      setDoc(data.doc);
      // Reinicia o estado do prompt colapsado sempre que o documento é carregado.
      setIsPromptCollapsed(true);
    } catch (err) {
      setError(err.message);
      setDoc(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="mb-4 text-xl font-semibold">Anotações e Vídeo</h2>

      {/* Tab controls */}
      <div className="mb-4 flex">
        <button
          onClick={() => setActiveTab("video")}
          className={`btn ${activeTab === "video" ? "btn-secondary" : "btn-outline-secondary"}`}
        >
          Vídeo
        </button>
        <button
          onClick={() => {
            setActiveTab("anotacoes");
            handleCreateOrView();
          }}
          className={`btn ${activeTab === "anotacoes" ? "btn-secondary" : "btn-outline-secondary"}`}
        >
          {loading ? "Processando..." : "Anotações"}
        </button>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "video" && (
          <div className="flex justify-center">
            <iframe
              src={embed}
              title="Vídeo"
              style={{ width: "100%", height: "500px" }}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {activeTab === "anotacoes" && (
          <div>
            {error && <p className="mt-2 text-red-500">Erro: {error}</p>}
            {doc && (
              <div className="space-y-4">
                <div className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Prompts</h3>
                    <button
                      onClick={() => setIsPromptCollapsed(!isPromptCollapsed)}
                      className="btn btn-outline-primary text-sm"
                    >
                      {isPromptCollapsed ? "Mostrar" : "Ocultar"}
                    </button>
                  </div>
                  {!isPromptCollapsed && <AIPrompt />}
                </div>
                <div className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Anotações</h3>
                    <iframe
                      src={doc.webViewLink}
                      title="Documento de Anotação"
                      style={{ width: "100%", height: "800px" }}
                    />
                  </div></div></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}