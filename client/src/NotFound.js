import React, {PureComponent} from 'react';
import {Helmet} from "react-helmet";
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';

import Footer from './Footer';

import './NotFound.css'

class NotFound extends PureComponent {

    render() {
        return (
            <div>
                <Helmet>
                    <title>{this.props.title}</title>
                    <link rel="icon" type="image/png" href="img/favicon.png"/>
                </Helmet>
                <div className="container estreias">
                    <div className="row notfound">
                        <div className="col-lg-6 col-md-12">
                            <div className="quote">Houston, we have a problem.</div>
                            <div className="quote-img">
                                <img alt="-v-" src="img/quote.png"/>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 links">
                            <p>
                                O conteúdo procurado não foi encontrado!<br/>
                                Acesse uma das páginas abaixo.
                            </p>
                            <Link className="estreia cinema" to="/cinema">Estreias de Cinema</Link>
                            <Link className="estreia netflix" to="/netflix">Estreias da Netflix</Link>
                            <Link className="estreia hbo-go" to="/hbo-go">Estreias da HBO Go</Link>
                            <Link to="/sobre">Sobre</Link>
                            <Link to="/contato">Contato</Link>
                            <Link to="/contato">Reporte um erro!</Link>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

NotFound.propTypes = {
    title: PropTypes.string
};

export default NotFound;
