import React, {PureComponent} from 'react';
import {Helmet} from "react-helmet";
import PropTypes from 'prop-types';
import axios from 'axios';

import Header from './Header';
import Footer from './Footer';

import './Contato.css'

class Contato extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mensagem: "",
            mensagemTipo: "",
            formNome: "",
            formEmail: "",
            formTipo: "contato",
            formMensagem: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({mensagem: "", mensagemTipo: ""});

        let {formNome, formEmail, formTipo, formMensagem} = this.state;

        axios.post("/api/contato", {formNome, formEmail, formTipo, formMensagem})
            .then((result) => {
                if (result.status === 200) {
                    this.setState({
                        mensagem: result.data,
                        mensagemTipo: "sucesso",
                        formNome: "",
                        formEmail: "",
                        formTipo: "contato",
                        formMensagem: ""
                    });
                } else {
                    this.setState({
                        mensagem: result.data,
                        mensagemTipo: "falha",
                        formNome: "",
                        formEmail: "",
                        formTipo: "contato",
                        formMensagem: ""
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    mensagem: error.response.data,
                    mensagemTipo: "falha",
                    formNome: "",
                    formEmail: "",
                    formTipo: "contato",
                    formMensagem: ""
                });
            });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps() {
        window.scrollTo(0, 0);
    }

    render() {
        let type = ["cinema", "netflix", "hbo-go"];
        let typeRandom = parseInt(Math.random() * 10, 10) % 3;

        let retornoForm = "retorno-form " + this.state.mensagemTipo;

        return (
            <div>
                <Helmet>
                    <title>{this.props.title}</title>
                    <link rel="icon" type="image/png" href="img/favicon.png"/>
                </Helmet>
                <div className="container estreias">
                    <div className="row">
                        <Header title="Contato"/>
                    </div>
                    <div className="row contato">
                        <div className="col-md-12">
                            <p>
                                Encontrou algum <strong>erro</strong>, possui uma <strong>sugestão</strong> ou quer
                                apenas <strong>falar conosco</strong>? Preencha o formulário
                                abaixo! <span role="img" aria-label="wink" className="icon">😉</span>
                            </p>
                        </div>
                        <div className="col-md-12">
                            <div className={retornoForm}>{this.state.mensagem}</div>

                            <form className={type[typeRandom]} onSubmit={this.handleSubmit}>
                                <label>
                                    Nome<br/>
                                    <input
                                        name="formNome"
                                        type="text"
                                        value={this.state.formNome}
                                        onChange={this.handleInputChange}
                                        required/>
                                </label>
                                <br />
                                <label>
                                    Email<br/>
                                    <input
                                        name="formEmail"
                                        type="email"
                                        value={this.state.formEmail}
                                        onChange={this.handleInputChange}
                                        required/>
                                </label>
                                <br />
                                <label>
                                    Tipo de contato<br/>
                                    <select name="formTipo" value={this.state.formTipo}
                                            onChange={this.handleInputChange}>
                                        <option value="contato">Quero entrar em contato</option>
                                        <option value="erro">Quero reportar um erro</option>
                                        <option value="sugestao">Tenho uma sugestão a fazer</option>
                                        <option value="reclamacao">Quero reclamar de algum conteúdo do site</option>
                                    </select>
                                </label>
                                <br />
                                <label>
                                    Mensagem<br/>
                                    <textarea name="formMensagem" value={this.state.formMensagem}
                                              onChange={this.handleInputChange} rows="8"
                                              placeholder="Solte suas palavras!"
                                              required/>
                                </label>
                                <br />
                                <input className="button" type="submit" value="Enviar"/>
                            </form>


                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

Contato.propTypes = {
    title: PropTypes.string
};

export default Contato;
