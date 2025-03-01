import React, { useState } from "react";

/**
 * AnnotationDocument component displays two tabs: one for VIDEO and one for ANOTAÇÕES.
 * 
 * Props:
 * - videoId: string (required) - The video identifier used for both the YouTube embed and to fetch the annotation document.
 *
 * The "Vídeo" tab (active by default) shows the embedded YouTube video.
 * The "Anotações" tab provides a button to create or view the Google Docs annotation document via the backend API.
 */
export default function AnnotationDocument({ videoId }) {
  // Default active tab set to "video" so that the video appears initially.
  const [activeTab, setActiveTab] = useState("video"); // "video" or "anotacoes"
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    } catch (err) {
      setError(err.message);
      setDoc(null);
    } finally {
      setLoading(false);
    }
  };

  // Construct the YouTube embed URL using the provided videoId.
  const videoSrc = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="p-4 border rounded-md">
      <h2 className="mb-4 text-xl font-semibold">Anotações e Vídeo</h2>

      {/* Tab controls */}
      <div className="mb-4 border-b">
        <button
          onClick={() => setActiveTab("video")}
          className={`px-4 py-2 font-medium ${
            activeTab === "video" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
          } focus:outline-none`}
        >
          Vídeo
        </button>
        <button
          onClick={() => setActiveTab("anotacoes")}
          className={`px-4 py-2 font-medium ${
            activeTab === "anotacoes" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
          } focus:outline-none`}
        >
          Anotações
        </button>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "video" && (
          <div className="flex justify-center">
            <iframe
              src={videoSrc}
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
            <button
              onClick={handleCreateOrView}
              className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              disabled={loading}
            >
              {loading ? "Processando..." : "Criar/Visualizar Anotação"}
            </button>
            {error && <p className="mt-2 text-red-500">Erro: {error}</p>}
            {doc && (
              <iframe
                src={doc.webViewLink}
                title="Documento de Anotação"
                style={{ width: "100%", height: "800px" }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}