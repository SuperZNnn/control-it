import React, { useEffect } from "react";
import './style.css';
import { useNavigate } from "react-router-dom";
import { useSession } from "../../SessionContext";

const StartPage = () => {
    const navigate = useNavigate();
    const { session, logout } = useSession();

    const handleLogout = () => {
        logout();
        navigate('/login')
    }

    useEffect(() => {
        if (session === null) {
            navigate('/login')
        }
    },[session])

    return (
        <section>
            <h1>{`${session !== null ? session.userId : ''}`}</h1>
            <button onClick={handleLogout}>Sair</button>
        </section>
    );
}

export default StartPage;
