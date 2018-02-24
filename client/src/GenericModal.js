import React, {PureComponent} from 'react';
import {Modal} from 'react-bootstrap';
import Trailer from './Trailer';
import PropTypes from 'prop-types';

import './GenericModal.css';

class GenericModal extends PureComponent {
    constructor(props) {
        super(props);

        this.changeType = this.changeType.bind(this);

        this.state = {
            modaltype: this.props.modaltype
        };
    }

    changeType = () => {
        this.setState((prevState) => {
            return {modaltype: (prevState.modaltype === "modalMovie") ? "modalTrailer" : "modalMovie"};
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
            icon = (pont > 6) ? "fa fa-chevron-circle-up" : "fa fa-chevron-circle-down";
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

                        <button className={!movie.trailerURL ? "button disabled" : "button"} onClick={this.changeType} disabled={!movie.trailerURL}>
                            <i className="fa fa-play-circle" aria-hidden="true"/>
                            Assistir Trailer
                        </button>
                        <br/>
                        {type === "netflix" &&
                        <a className={!movie.netflixURL ? "button disabled" : "button"}
                           href={movie.netflixURL} target="_blank">
                            <span className="fa fa-film" aria-hidden="true"/>
                            Assistir na Netflix
                        </a>}
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
                            {movie.genre.map((g) =>
                                <div key={g}>
                                    <span className={this.iconGenre(g)} aria-hidden="true"/> {g}
                                </div>
                            )}
                        </div>}
                        {movie.productionYear && <div className="item">
                            <div className="header">Ano de produção</div>
                            {movie.productionYear}
                        </div>}
                    </div>
                    <div className="col-md-5">
                        {movie.director && <div className="item">
                            <div className="header">Direção</div>
                            {movie.director.map((dir) => <div key={dir}>{dir}</div>)}
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
                <Trailer className="trailer" title={movie.title} src={video} type={type}/>
                <div className="col-md-12 text-center">
                    <button className="button" onClick={this.changeType}>
                        <span className="fa fa-plus-circle" aria-hidden="true"/>
                        Saiba mais
                    </button>
                    {type === "netflix" &&
                    <a className={!movie.netflixURL ? "button disabled" : "button"}
                       href={movie.netflixURL} target="_blank">
                        <span className="fa fa-film" aria-hidden="true"/>
                        Assistir na Netflix
                    </a>}
                </div>
            </Modal.Body>
        </Modal>
    };

    render() {
        const movie = this.props.content;
        const modaltype = this.state.modaltype;
        const estreiatype = this.props.estreiatype;

        if (modaltype === "modalMovie") {
            return (this.movieModal(estreiatype, movie));
        } else if (modaltype === "modalTrailer") {
            return (this.trailerModal(estreiatype, movie));
        }
    }
}

GenericModal.propTypes = {
    estreiatype: PropTypes.string,
    modaltype: PropTypes.string,
    content: PropTypes.object
};

export default GenericModal;
