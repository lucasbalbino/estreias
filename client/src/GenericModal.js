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

    applyGenre = (genreId) => {
        let genres = this.props.list ? this.props.list.genres : null;
        if (!genres) {
            return <span/>
        }

        let index = genres.map(function (e) {
            return e["just_watch_id"];
        }).indexOf(genreId);
        if (index >= 0) {
            let icon = "fa " + genres[index].icon;
            return <span><span className={icon} aria-hidden="true"/> {genres[index].name}</span>
        } else {
            return <span><span className="fa fa-cogs" aria-hidden="true"/> {genreId}</span>
        }
    };

    getMovieAge = (classif) => {
        if (classif) {
            return (classif === "livre" || classif === "L") ?
                <img alt={classif} src="./img/livre.png"/> :
                <img alt={classif} src={"./img/" + classif + "anos.png"}/>;
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
                <span className="value">{pont}/10</span>
                <span className={icon} aria-hidden="true"/>
            </span>;
        } else if (type === "mc") {
            icon = (pont > 60) ? "fa fa-chevron-circle-up" : "fa fa-chevron-circle-down";
            return <span>
                <span className="label">Metacritic </span>
                <span className="value">{pont}/100</span>
                <span className={icon} aria-hidden="true"/>
            </span>;
        }
    };

    movieModal = (type, movie) => {
        let imdb = "http://www.imdb.com/title/" + movie.idIMDB;

        return <Modal {...this.props} bsSize="large" className={type}>
            <Modal.Header closeButton>
                <h3>{movie.title} <span
                    className="subtitle">({movie.subtitle ? movie.subtitle : movie.title})</span></h3>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-4 text-center">
                        {movie.posterImage &&
                        <img alt={movie.title} className="img-fluid img-poster" src={movie.posterImage}/>}

                        <button className={!movie.trailerURL ? "button disabled" : "button"} onClick={this.changeType}
                                disabled={!movie.trailerURL}>
                            <i className="fa fa-play-circle" aria-hidden="true"/>
                            Assistir Trailer
                        </button>
                        {movie.idIMDB &&
                        <a className="button" href={imdb} target="_blank">
                            <span className="fa fa-imdb" aria-hidden="true"/>
                            Acessar IMDB
                        </a>}
                        {type === "netflix" &&
                        <a className={!movie.netflixURL ? "button disabled" : "button main"}
                           href={movie.netflixURL} target="_blank">
                            <span className="fa fa-film" aria-hidden="true"/>
                            Assistir na Netflix
                        </a>}
                        {type === "hbo-go" &&
                        <a className={!movie.hbogoURL ? "button disabled" : "button main"}
                           href={movie.hbogoURL} target="_blank">
                            <span className="fa fa-film" aria-hidden="true"/>
                            Assistir na HBO Go
                        </a>}
                    </div>
                    <div className="col-md-3">
                        {movie.runtime > 0 && <div className="item">
                            <div className="header">Duração</div>
                            {movie.runtime} min
                        </div>}
                        {movie.distribution && movie.distribution.length > 0 &&
                        this.props.list && this.props.list.distribution.length > 0 &&
                        <div className="item">
                            <div className="header">Distribuição</div>
                            {movie.distribution.map((d) => {
                                let distribution = this.props.list.distribution;
                                let i = distribution.map(function (e) {
                                    return e.id;
                                }).indexOf(d);

                                return (i) ? <div key={d}>{distribution[i].name}</div> : null;
                            })}
                        </div>}
                        {movie.releaseDate && <div className="item">
                            <div className="header">Data de estreia</div>
                            {movie.releaseDate}
                        </div>}
                        {movie.netflixDate && <div className="item">
                            <div className="header">Início na Netflix</div>
                            {movie.netflixDate}
                        </div>}
                        {movie.hbogoDate && <div className="item">
                            <div className="header">Início na HBO Go</div>
                            {movie.hbogoDate}
                        </div>}
                        {movie.country && movie.country.length > 0 &&
                        this.props.list && this.props.list.country.length > 0 &&
                        <div className="item">
                            <div className="header">País</div>
                            {movie.country.map((c) => {
                                let country = this.props.list.country;
                                let i = country.map(function (e) {
                                    return e.id;
                                }).indexOf(c);
                                return (i) ? <div key={c}>{country[i].name}</div> : null;
                            })}
                        </div>}
                        {movie.genre && movie.genre.length > 0 && <div className="item">
                            <div className="header">Gênero</div>
                            {movie.genre.map((g) =>
                                <div key={g}>
                                    {this.applyGenre(g)}
                                </div>
                            )}
                        </div>}
                        {movie.year && <div className="item">
                            <div className="header">Ano</div>
                            {movie.year}
                        </div>}
                    </div>
                    <div className="col-md-5">
                        {movie.director && movie.director.length > 0 && <div className="item">
                            <div className="header">Direção</div>
                            {movie.director.map((dir) => <div key={dir}>{dir}</div>)}
                        </div>}
                        {movie.cast && movie.cast.length > 0 && <div className="item">
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
                    {movie.score && movie.score.map((score) =>
                        (score.rating > 0) ? <div className="score" key={score.type}>
                            {this.getScore(score.type, score.rating)}
                        </div> : null
                    )}
                </div>
                {type === "cinema" && <div className="screen-format">
                    Formatos: 2D
                    {movie.is3D && <img alt="3D" src="./img/3d.png"/>}
                    {movie.isIMAX && <img alt="IMAX" src="./img/imax.png"/>}
                </div>}
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
                    {type === "hbo-go" &&
                    <a className={!movie.hbogoURL ? "button disabled" : "button"}
                       href={movie.hbogoURL} target="_blank">
                        <span className="fa fa-film" aria-hidden="true"/>
                        Assistir na HBO Go
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
    content: PropTypes.object,
    list: PropTypes.object
};

export default GenericModal;
