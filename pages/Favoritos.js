import React from "react";
import NavBarComponent from "../components/NavBarComponent";

const Favoritos = () => {
  return (
    <div>
    <NavBarComponent active="favoritos" />
      <div className="container">
        <h1>React Bootstrap</h1>

        <button className="btn btn-primary">Clique em Mim</button>
      </div>
    </div>
  );
};

export default Favoritos;
