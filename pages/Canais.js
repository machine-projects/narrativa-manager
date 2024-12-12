import React from "react";
import NavBarComponent from "../components/NavBarComponent";
import CreateChannelModal from "../components/CreateChannelModal";

const CadastrarCanal = () => {
  return (
    <div>
      <CreateChannelModal />
      <NavBarComponent active="canais" />
      <div className="container">
        <div className="d-flex justify-content-between mt-3">
          <h2>Cadastrar Canal</h2>
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Cadastrar Novo</button>
        </div>

        <div className="row mt-4">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Idioma</th>
                <th scope="col">Nome</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CadastrarCanal;
