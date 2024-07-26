import React, { useEffect, useState, useRef } from "react";
import './style.css';
import { useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from 'axios';

const validationSchemaRegister = Yup.object().shape({
    name: Yup.string().required('Obrigatório'),
    email: Yup.string().email('E-mail inválido').required('Obrigatório'),
    c_email: Yup.string().oneOf([Yup.ref('email'), null], 'Os campos não coincidem!').required('Obrigatório'),
    password: Yup.string().required('Obrigatório').min(8, 'A senha deve possuir ao menos 8 caractéres'),
    c_password: Yup.string().oneOf([Yup.ref('password'), null], 'Os campos não coincidem!').required('Obrigatório')
})
const validationSchemaLogin = Yup.object().shape({
    email: Yup.string().email('E-mail inválido').required('Obrigatório'),
    password: Yup.string().required('Obrigatório').min(8, 'A senha deve possuir ao menos 8 caractéres')
})

const LoginForm = ({ addMessage }) => {
    const location = useLocation();

    const [readyForAnim, setReadyForAnim] = useState(false)
    const [formAnim, setFormAnim] = useState(`${location.pathname === '/login' ? 'hidded': ''}`);

    const formikRef = useRef(null);

    useEffect(() => {
        if (readyForAnim){
            if (location.pathname === '/register') {
                setFormAnim('showAnim');
                
            }
            else if (location.pathname === '/login'){
                setFormAnim('hideAnim');
                document.querySelectorAll('.login-form form input').forEach(e => {
                    e.value = '';
                })
                if (formikRef.current) {
                    formikRef.current.resetForm();
                }
            }
        }
        else {setReadyForAnim(true);}

        
        
    }, [location.pathname]);

    const usingValidationSchema = location.pathname==='/login' ? validationSchemaLogin: validationSchemaRegister

    let noValidOn;
    const noValid = () => {
        noValidOn = setTimeout(() => {
            addMessage('Oops','Parece que alguns campos foram preenchidos incorretamente!')
        }, 200);
    }

    const submitValues = (values) => {
        const params = new URLSearchParams(values);

        axios.get(`http://localhost:8080/control-it-back/?registerPeople&${params}`)
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.error(error)
        })
    }

    return (
        <div className="login-form">
            <h1>{`${location.pathname === '/login' ? 'Login': 'Registro'}`}</h1>
            <Formik
                innerRef={formikRef}
                initialValues={{}}
                onSubmit={values => {
                    addMessage('Boa',`${location.pathname === '/login' ? 'Logado com sucesso!': 'Registrado com sucesso!'}`);
                    clearTimeout(noValidOn);

                    submitValues(values);
                }}
                validationSchema={usingValidationSchema}
            >

                {({handleSubmit, resetForm}) => (
                    <Form onSubmit={handleSubmit}>
                        <Field type="text" id="name" name="name" placeholder="Nome" className={formAnim}/>
                        <ErrorMessage className="error-message" name="name" component="p"/>

                        <Field type="text" id="email" name="email" placeholder="E-mail"/>
                        <ErrorMessage className="error-message" name="email" component="p"/>
                        <Field type="text" id="c_email" name="c_email" placeholder="Confirme seu E-mail" className={formAnim} style={{animationDelay: '.25s'}}/>
                        <ErrorMessage className="error-message" name="c_email" component="p"/>

                        <Field type="password" id="password" name="password" placeholder="Senha"/>
                        <ErrorMessage className="error-message" name="password" component="p"/>
                        <Field type="password" id="c_password" name="c_password" placeholder="Confirme sua Senha" className={formAnim} style={{animationDelay: '.5s'}}/>
                        <ErrorMessage className="error-message" name="c_password" component="p"/>

                        <div className="buttons-container">
                            <button type="submit" onClick={noValid} style={{width:`${location.pathname === '/login' ? '50%': '100%'}`}}>{`${location.pathname === '/login' ? 'Entrar': 'Cadastrar'}`}</button>
                            
                            {location.pathname === '/login' && (
                                <button type="button" style={{fontSize: '2vh'}}>Esqueci minha senha</button>
                            )}
                            
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default LoginForm;