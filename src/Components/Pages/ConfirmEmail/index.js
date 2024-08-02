import React, { useContext, useEffect } from "react";
import './style.css';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSession } from "../../SessionContext";

const ConfirmEmail = ({ addMessage }) => {
    const navigate = useNavigate();
    const { token } = useParams();
    const { login } = useSession();

    let allowSendRequest = false;
    useEffect(() => {
        if (allowSendRequest) {
            axios.get(`http://localhost:8080/control-it-back/?finishRegister&token=${encodeURIComponent(token)}`)
                .then(response => {
                    if (response.data.resp === "invalid") {
                        addMessage('Oops', 'Token inválido');
                        navigate('/start');
                    }
                    else if (response.data.resp === "valid") {
                        addMessage('Boa', 'Registrado com sucesso!');
                        login(response.data.sessionId)
                        navigate('/start');
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
        else {
            allowSendRequest = true;
        }
    }, []);

    return (
        <section>
            
        </section>
    );
}

export default ConfirmEmail;
