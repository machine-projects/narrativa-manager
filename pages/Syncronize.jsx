import React, { useState, useEffect } from "react";
import NavBarComponent from "../components/NavBarComponent";
import PaginateComponent from "../components/PaginateComponent";
import axios from "axios";

const IndexSincronize = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsLimit] = useState(10);
  const [filters, setFilters] = useState({
    channel_id: "",
    language: "",
    targetLanguage: "",
    type_platforms: "",
    isFamilySafe: "",
    targets: "",
    createdAfter: "",
    createdBefore: "",
    videos_id: "",
  });

  const listSyncronize = async (page) => {
    try {
      const response = await axios.get("/api/videos/syncronize", {
        params: {
          ...filters,
          page,
          limit: itemsLimit,
        },
      });
      setData(response.data.data || []);
      setCurrentPage(Number(response.data.page));
      setTotalPages(Number(response.data.totalPages));
    } catch (error) {
      console.error("Erro ao buscar dados de sincronização:", error);
    }
  };

  const formatDate = (date) => {
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString("pt-BR");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    listSyncronize(1);
  }, [filters]);

  return (
    <div>
      <NavBarComponent active="sincronize" />
      <div className="container">
        <div className="d-flex justify-content-between mt-3">
          <h2>Sincronização de Dados</h2>
        </div>

        <div className="row mt-4">
          <div className="col-12 mb-3">
            <h5>Filtros</h5>
            <div className="row g-2">
              <div className="col-md-3">
                <input
                  type="text"
                  name="channel_id"
                  className="form-control"
                  placeholder="Channel ID"
                  value={filters.channel_id}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="language"
                  className="form-control"
                  placeholder="Idioma"
                  value={filters.language}
                  onChange={handleFilterChange}
                />
              </div>
            
              <div className="col-md-3">
                <input
                  type="text"
                  name="type_platforms"
                  className="form-control"
                  placeholder="Plataforma"
                  value={filters.type_platforms}
                  onChange={handleFilterChange}
                />
              </div>
             
              <div className="col-md-3">
                <input
                  type="text"
                  name="targets"
                  className="form-control"
                  placeholder="Alvos"
                  value={filters.targets}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  name="createdAfter"
                  className="form-control"
                  value={filters.createdAfter}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  name="createdBefore"
                  className="form-control"
                  value={filters.createdBefore}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="videos_id"
                  className="form-control"
                  placeholder="Video ID"
                  value={filters.videos_id}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => listSyncronize(1)}
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome do Canal</th>
                <th scope="col">Idioma</th>
                <th scope="col">Data de Criação</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.channel_name_presentation}</td>
                    <td>{item.language}</td>
                    <td>{formatDate(item.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Nenhum dado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PaginateComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => listSyncronize(page)}
        />
      </div>
    </div>
  );
};

export default IndexSincronize;
