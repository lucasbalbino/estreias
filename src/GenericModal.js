import React, {PureComponent} from 'react';
import {Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';

import './GenericModal.css';

class GenericModal extends PureComponent {
    constructor(props) {
        super(props);

        this.changeType = this.changeType.bind(this);

        this.state = {modalType: this.props.modalType};
    }

    changeType = () => {
        this.setState((prevState) => {
            return {modalType: (prevState.modalType === "modalMovie") ? "modalTrailer" : "modalMovie"};
        });
    };

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
        } else if (type === "imdb") {
            icon = (pont > 5) ? "fa fa-chevron-circle-up" : "fa fa-chevron-circle-down";
            return <span>
                <span className="label">IMDB </span>
                <span className="value">{pont}</span>
                <span className={icon} aria-hidden="true"/>
            </span>;
        }
    };

    movieModal = (type, movie) => {
        return <Modal {...this.props} bsSize="large" className={type}>
            <Modal.Header closeButton>
                <h3>{movie.title} <span
                    className="subtitle">({movie.subtitle ? movie.subtitle : movie.title})</span></h3>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-4 text-center">
                        <img alt={movie.title} className="img-fluid img-poster" src={movie.posterImage}/>

                        <button className="button" onClick={this.changeType}>
                            <i className="fa fa-play-circle" aria-hidden="true"/>
                            Assistir Trailer
                        </button>
                    </div>
                    <div className="col-md-3">
                        {movie.duration && <div className="item">
                            <div className="header">Duração</div>
                            {movie.duration} min
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
                            {movie.country.map((c) => <div key={c}>{c}</div>)}
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
                            {movie.cast.map((actor) => <div key={actor}>{actor}</div>)}
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
    };

    trailerModal = (type, movie) => {
        let classType = "full-opacity " + type;
        let video = movie.trailerURL + "?rel=0&amp;showinfo=0";

        return <Modal {...this.props} bsSize="large" className={classType}>
            <Modal.Header className="invert" closeButton>
                <h3>{movie.title} <span
                    className="subtitle">({movie.subtitle ? movie.subtitle : movie.title})</span></h3>
            </Modal.Header>
            <Modal.Body>
                <div className="trailer embed-responsive embed-responsive-16by9">
                    <iframe title={movie.title} width="560" height="315"
                            src={video} frameBorder="0" allowFullScreen/>
                </div>
                <div className="col-md-12 text-center">
                    <button className="button" onClick={this.changeType}>
                        <span className="fa fa-plus-circle" aria-hidden="true"/>
                        Saiba mais
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    };

    render() {
        const movie = this.props.content;
        const modalType = this.state.modalType;
        const estreiaType = this.props.estreiaType;

        if (modalType === "modalMovie") {
            return (this.movieModal(estreiaType, movie));
        } else if (modalType === "modalTrailer") {
            return (this.trailerModal(estreiaType, movie));
        }
    }
}

GenericModal.propTypes = {
    estreiaType: PropTypes.string,
    modalType: PropTypes.string,
    content: PropTypes.object
};

export default GenericModal;
