"use client";

import React, { useState } from "react";

/**
 * AnnotationDocument component allows users to create or view the Google Docs
 * annotation document associated with a video. When the button is clicked, it calls
 * the API endpoint '/api/google-docs' with the given videoId. If the document exists,
 * its details are returned and displayed in an iframe.
 *
 * Props:
 * - videoId: string (required) - The identifier of the video for which to handle annotation documents.
 */
export default function AnnotationDocument({ videoId }) {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="p-4 border rounded-md">
      <h2 className="mb-2 text-xl font-semibold">
        Visualizar / Criar Documento de Anotação
      </h2>
      <button
        onClick={handleCreateOrView}
        className="mb-4 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
        disabled={loading}
      >
        {loading ? "Processando..." : "Criar/Visualizar Anotação"}
      </button>
      {error && <p className="mt-2 text-red-500">Erro: {error}</p>}
      {doc && (
        <iframe
          src={doc.webViewLink}
          title="Documento de Anotação"
          className="w-full h-[500px] border"
        />
      )}
    </div>
  );
}