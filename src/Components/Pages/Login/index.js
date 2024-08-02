import React, { useEffect, useState, useRef } from "react";
import './style.css';
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from 'axios';
import { useSession } from "../../SessionContext";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";

const validationSchemaRegister = Yup.object().shape({
    name: Yup.string().required('Obrigatório'),
    email: Yup.string().email('E-mail inválido').required('Obrigatório'),
    c_email: Yup.string().oneOf([Yup.ref('email'), null], 'Os campos não coincidem!').required('Obrigatório'),
    password: Yup.string().required('Obrigatório').min(8, 'A senha deve possuir ao menos 8 caractéres'),
    c_password: Yup.string().oneOf([Yup.ref('password'), null], 'Os campos não coincidem!').required('Obrigatório')
});
const validationSchemaLogin = Yup.object().shape({
    email: Yup.string().email('E-mail inválido').required('Obrigatório'),
    password: Yup.string().required('Obrigatório').min(8, 'A senha deve possuir ao menos 8 caractéres')
});

const LoginForm = ({ addMessage }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useSession();

    const [readyForAnim, setReadyForAnim] = useState(false);
    const [formAnim, setFormAnim] = useState(`${location.pathname === '/login' ? 'hidded' : ''}`);
    const [buttonWorking, setButtonWorking] = useState('submit');
    const [sttDivLoadAnim, setSttDivLoadAnim] = useState('form-load-bar');
    const [sttLoaLoadAnim, setSttLoaLoadAnim] = useState('loader');

    const formikRef = useRef(null);

    useEffect(() => {
        if (readyForAnim) {
            if (location.pathname === '/register') {
                setFormAnim('showAnim');
            }
            else if (location.pathname === '/login') {
                setFormAnim('hideAnim');

                document.querySelectorAll('.login-form form input').forEach(e => {
                    e.value = '';
                });
                if (formikRef.current) {
                    formikRef.current.resetForm();
                }
            }
        }
        else {
            setReadyForAnim(true);
        }
    }, [location.pathname]);

    const usingValidationSchema = location.pathname === '/login' ? validationSchemaLogin : validationSchemaRegister;

    let noValidOn;
    const noValid = () => {
        noValidOn = setTimeout(() => {
            addMessage('Oops', 'Parece que alguns campos foram preenchidos incorretamente!');
        }, 200);
    }

    const submitValues = (values) => {
        const params = new URLSearchParams(values);

        if (location.pathname === '/login') {
            // Login Local
            axios.get(`http://localhost:8080/control-it-back/?tryLogin&${params}`)
                .then(response => {
                    if (response.data.resp === 'invalid') {
                        addMessage('Oops', 'E-mail não cadastrado!');
                    }
                    else if (response.data.resp === 'inccorretPassword') {
                        addMessage('Oops', 'Senha Incorreta!');
                    }
                    else if (response.data.resp === 'logged') {
                        addMessage('Boa', 'Logado com sucesso!');
                        login(response.data.sessionId);
                        navigate('/start');
                    }

                    document.querySelectorAll('.login-form form input').forEach(e => {
                        e.value = '';
                    });
                    if (formikRef.current) {
                        formikRef.current.resetForm();
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
        else if (location.pathname === '/register') {
            // Registro Local
            // Desativar botão temporariamente
            setButtonWorking('button');
            setSttDivLoadAnim('form-load-bar load-anim');
            setSttLoaLoadAnim('loader intro');

            setTimeout(() => {
                axios.get(`http://localhost:8080/control-it-back/?registerPeople&${params}`)
                    .then(response => {
                        if (response.data.resp === "success") {
                            addMessage('Boa', 'Verifique sua caixa de entrada e a pasta de spam para concluir seu cadastro.');
                        }
                        else if (response.data.resp === "emailExist") {
                            addMessage('Oops', 'Parece que esse e-mail já foi cadastrado');
                        }
                        else if (response.data.resp === "alreadyExist") {
                            addMessage('Atenção', 'Já foi enviado um e-mail de confirmação, verifique na caixa de entrada e no spam!');
                        }

                        // Reativar botão
                        setButtonWorking('submit');
                        setSttLoaLoadAnim('loader outro');
                        setTimeout(() => {
                            setSttDivLoadAnim('form-load-bar');
                        }, 500);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }, 1000);
        }
    }

    const authenticateWithGoogle = (email,name) => {
        axios.get(`http://localhost:8080/control-it-back/?registerPeopleGoogle&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`)
        .then(response => {
            if (response.data.resp === 'logged'){
                addMessage('Boa', 'Logado com sucesso!');
                login(response.data.id);
                navigate('/start');
            }
            else if (response.data.resp === 'changeAccount'){
                addMessage('Atenção', 'Conta já está cadastrada. Agora, você pode acessá-la com o Google!');
                login(response.data.id);
                navigate('/start');
            }
            else if (response.data.resp === 'register'){
                addMessage('Boa', 'Usuário cadastrado com sucesso!');
                login(response.data.id);
                navigate('/start');
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    return (
        <div className="login-form">
            <h1>{`${location.pathname === '/login' ? 'Login' : 'Registro'}`}</h1>
            <Formik
                innerRef={formikRef}
                initialValues={{}}
                onSubmit={values => {
                    clearTimeout(noValidOn);
                    submitValues(values);
                }}
                validationSchema={usingValidationSchema}>

                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Field type="text" id="name" name="name" placeholder="Nome" className={formAnim} />
                        <ErrorMessage className="error-message" name="name" component="p" />

                        <Field type="text" id="email" name="email" placeholder="E-mail" />
                        <ErrorMessage className="error-message" name="email" component="p" />
                        <Field type="text" id="c_email" name="c_email" placeholder="Confirme seu E-mail" className={formAnim} style={{ animationDelay: '.25s' }} />
                        <ErrorMessage className="error-message" name="c_email" component="p" />

                        <Field type="password" id="password" name="password" placeholder="Senha" />
                        <ErrorMessage className="error-message" name="password" component="p" />
                        <Field type="password" id="c_password" name="c_password" placeholder="Confirme sua Senha" className={formAnim} style={{ animationDelay: '.5s' }} />
                        <ErrorMessage className="error-message" name="c_password" component="p" />

                        <div className="buttons-container">
                            <button type={buttonWorking} onClick={noValid} style={{ width: `${location.pathname === '/login' ? '50%' : '100%'}` }}>{`${location.pathname === '/login' ? 'Entrar' : 'Cadastrar'}`}</button>

                            {location.pathname === '/login' && (
                                <button type="button" style={{ fontSize: '2vh' }}>Esqueci minha senha</button>
                            )}

                        </div>
                    </Form>
                )}
            </Formik>

            <div className={sttDivLoadAnim}>
                <div className={sttLoaLoadAnim} />
            </div>

            <div className="form-separator"/>

            <h2 className="continue-with">Continuar com</h2>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    let googleToken = jwtDecode(credentialResponse?.credential)
                    authenticateWithGoogle(googleToken.email,googleToken.given_name);
                }}
                onError={error => {
                    console.log(error)
                }}
                text="continue_with"
            />
        </div>
    )
}

export default LoginForm;
