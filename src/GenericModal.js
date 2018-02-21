import React, {PureComponent} from 'react';
import {Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';

import './GenericModal.css';

class GenericModal extends PureComponent {

    iconGenre = (genre) => {
        switch (genre) {
            case "Ação":
                return "fa fa-bomb";
            case "Documentário":
                return "fa fa-video-camera";
            case "Drama":
                return "fa fa-user";
            default:
                return "fa fa-cogs";
        }
    };

    getMovieAge = (classif) => {
        if (classif) {
            return <img alt={classif} src={require("./img/" + classif + "anos.png")}/>;
        }
    };

    getScore = (type, pont) => {
        let icon;
        if (type === "rt") {
            icon = (pont > 50) ? "fa fa-chevron-circle-up" : "fa fa-chevron-circle-down";
            return <span>
                <span className="label">Rotten Tomatoes </span>
                <span className="value">{pont}%</span>
                <span className={icon} aria-hidden="true"/>
            </span>;
        } else if(type === "imdb") {
            icon = (pont > 5) ? "fa fa-chevron-circle-up" : "fa fa-chevron-circle-down";
            return <span>
                <span className="label">IMDB </span>
                <span className="value">{pont}</span>
                <span className={icon} aria-hidden="true"/>
            </span>;
        }
    };

    render() {
        const movie = this.props.content;
        return (
            <Modal {...this.props} bsSize="large">
                <Modal.Header closeButton>
                    <h3>{movie.title} <span
                        className="subtitle">({movie.subtitle ? movie.subtitle : movie.title})</span></h3>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-4 text-center">
                            <img alt={movie.title} className="img-fluid img-poster" src={movie.posterImage}/>

                            <a className="button" href="#trailer1" data-toggle="modal" data-dismiss="modal">
                                <i className="fa fa-play-circle" aria-hidden="true"/>
                                Assistir Trailer
                            </a>
                        </div>
                        <div className="col-md-3">
                            {movie.duration && <div className="item">
                                <div className="header">Duração</div>
                                {movie.duration}
                            </div>}
                            {movie.distribution && <div className="item">
                                <div className="header">Distribuição</div>
                                {movie.distribution.join(" / ")}
                            </div>}
                            {movie.releaseDate && <div className="item">
                                <div className="header">Data de estreia</div>
                                {movie.releaseDate}
                            </div>}
                            {movie.country && <div className="item">
                                <div className="header">País</div>
                                {movie.country.join('<br>')}
                            </div>}
                            {movie.genre && <div className="item">
                                <div className="header">Gênero</div>
                                <span className={this.iconGenre(movie.genre)} aria-hidden="true"/> {movie.genre}
                            </div>}
                            {movie.productionYear && <div className="item">
                                <div className="header">Ano de produção</div>
                                {movie.productionYear}
                            </div>}
                        </div>
                        <div className="col-md-5">
                            {movie.director && <div className="item">
                                <div className="header">Direção</div>
                                {movie.director}
                            </div>}
                            {movie.cast && <div className="item">
                                <div className="header">Elenco</div>
                                {movie.cast.join('<br>')}
                            </div>}
                            {movie.synopsis && <div className="item">
                                <div className="header">Sinopse</div>
                                {movie.synopsis}
                            </div>}
                            {movie.movieAge && <span className="movie-age">
                                Classificação Indicativa {this.getMovieAge(movie.movieAge)}
                            </span>}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="score-set">
                        Pontuação:
                        {movie.score && movie.score.map((score) =>
                            <div className="score" key={score.type}>
                                {this.getScore(score.type, score.pontuation)}
                            </div>
                        )}
                    </div>
                    <div className="screen-format">
                        Disponivel nos formatos: 2D
                        {movie.screenFormat && movie.screenFormat.map((format) =>
                            <img alt={format} key={format}
                                 src={require("./img/" + format + ".png")}/>
                        )}
                    </div>
                </Modal.Footer>
            </Modal>
        )
    }
}

GenericModal.propTypes = {
    content: PropTypes.object
};

export default GenericModal;
