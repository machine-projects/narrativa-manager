import React from "react";
import NavBarComponent from "../components/NavBarComponent";

const Home = () => {
  return (
    <div>
      <NavBarComponent active="home" />
      <div className="container bg-light">
        <h2>Todos os videos</h2>

        <div className="row"></div>
      </div>
    </div>
  );
};

export default Home;
