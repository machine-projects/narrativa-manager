import React, { useState, useEffect } from "react";

import VideoDisplayComponent from "../components/VideoDisplayComponent";
import axios from "axios";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    channel_id: "",
    channels_ids: "",
    videos_urls: "",
    published_after: "",
    published_before: "",
    keywords_in_title: "",
    keywords_in_title_presentation: "",
    targets: "",
    targetLanguage: "",
    type_platforms: "",
    adm_channel_id: "",
    channel_name: "",
    channel_name_presentation: "",
  });

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const validFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value)
      );

      const serializedFilters = {
        ...validFilters,
        channels_ids: Array.isArray(validFilters.channels_ids)
          ? validFilters.channels_ids.join(",")
          : validFilters.channels_ids,
        targets: Array.isArray(validFilters.targets)
          ? validFilters.targets.join(",")
          : validFilters.targets,
      };

      const { data } = await axios.get(`/api/videos`, {
        params: {
          page,
          limit: 10,
          ...serializedFilters,
        },
      });
      setVideos(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page]);

  const handlePageChange = (direction) => {
    if (direction === "prev" && page > 1) {
      setPage(page - 1);
    } else if (direction === "next" && page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <VideoDisplayComponent
      videos={videos}
      loading={loading}
      page={page}
      totalPages={totalPages}
      handlePageChange={handlePageChange}
      filters={filters}
      setFilters={setFilters}
      fetchVideos={fetchVideos}
    />
  );
};

export default Home;
