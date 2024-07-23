import React from "react";
import './style.css';
import { Link } from "react-router-dom";

const HomeInfo = () => {

    return (
        <section className="home-info">
            <h1>Control It!</h1>
            <p>Sua apresentação nunca foi tão dinâmica!</p>
            <Link to='/start'><button>Começar</button></Link>
        </section>
    )
}

export default HomeInfo;