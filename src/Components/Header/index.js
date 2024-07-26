import React from "react";
import './style.css';
import { useLocation, Link } from "react-router-dom";

const Header = () => {
    const location = useLocation();

    return (
        <header>
            <Link to="/"><h1 className="header-title">Control It!</h1></Link>
            
            <nav className="header-nav">
                {location.pathname !== '/login' && location.pathname !== '/register' && (
                    <div className="pages-redirect">
                        <Link to="/sorteio"><button className={` ${ location.pathname === '/sorteio' ? 'selected': ''} `}>Sorteador</button></Link>
                        <Link to="/timer"><button className={` ${ location.pathname === '/timer' ? 'selected': '' } `}>Timer</button></Link>
                        <Link to="/avisos"><button className={` ${ location.pathname === '/avisos' ? 'selected': '' } `}>Avisos</button></Link>
                    </div>
                )}
                {location.pathname !== '/start' && (
                    <div className="sign-up">
                        <Link to='/login'><button>Entrar</button></Link>
                        <Link to='/register'><button className="register">Cadastre-se</button></Link>
                    </div>
                )}
            </nav>
        </header>
    )
}

export default Header;