import React, {PureComponent} from 'react';
import {Helmet} from "react-helmet";
import PropTypes from 'prop-types';

import Header from './Header';
import Footer from './Footer';

import './Sobre.css';

class Sobre extends PureComponent {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps() {
        window.scrollTo(0, 0);
    }

    render() {
        let type = ["cinema", "netflix", "hbo-go"];
        let typeRandom = parseInt(Math.random() * 10, 10) % 3;

        return (
            <div>
                <Helmet>
                    <title>{this.props.title}</title>
                    <link rel="icon" type="image/png" href="img/favicon.png"/>
                </Helmet>
                <div className="container estreias">
                    <div className="row">
                        <Header title="Sobre"/>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <p>O site <strong>Estreias</strong> busca reunir a última informação sobre o que há de
                                lançamento de
                                filmes no Brasil. Visamos evidenciar tanto o que está em cartaz no
                                <strong>Cinema</strong>, quanto
                                o que entrou no catálogo dos serviços de streaming presentes no país
                                (<strong><a href="https://www.netflix.com.br/" target="blank">Netflix</a></strong>
                                e <strong> <a href="https://www.hbogo.com.br/" target="blank">HBO Go</a></strong>).
                                Assim propiciamos aos visitantes uma visão geral do que ele pode encontrar em cada meio
                                ou mídia.</p>
                            <p>Nós buscamos informações de sites abertos e de APIs públicas reunindo dados relevantes
                                relacionados aos filmes estreados. </p>
                            <p>Seguem os serviços que monitoramos sobre os lançamentos de filmes:</p>

                            <div className="row logos">
                                <div className="col-md-3">
                                    <div className={type[typeRandom]}>
                                        <a href="http://www.filmeb.com.br/" target="blank">
                                            <img className="img-fluid" alt="Filme B" src="img/filmeb.png"/>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className={type[(typeRandom + 1) % 3]}>
                                        <a href="https://www.justwatch.com/br" target="blank">
                                            <img className="img-fluid" alt="Just Watch" src="img/justwatch.png"/>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className={type[(typeRandom + 2) % 3]}>
                                        <a href="https://www.themoviedb.org/" target="blank">
                                            <img className="img-fluid" alt="The Movie Database" src="img/tmdb.png"/>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className={type[typeRandom]}>
                                        <a href="http://www.omdbapi.com/" target="blank">
                                            <img className="img-fluid" alt="The Open Movie Database"
                                                 src="img/omdb.png"/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

Sobre.propTypes = {
    title: PropTypes.string
};

export default Sobre;
