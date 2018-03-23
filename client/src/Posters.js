import React, {PureComponent} from 'react';
import GenericModal from './GenericModal';
import Loading from './Loading';
import PropTypes from 'prop-types';

import './Posters.css'

class Posters extends PureComponent {
    constructor(props) {
        super(props);

        this.handleHideModal = this.handleHideModal.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.imageLoaded = this.imageLoaded.bind(this);
        this.imageError = this.imageError.bind(this);

        this.state = {};

        let posters = this.props.posters;
        if (posters) {
            for (let i = 0; i < posters.length; i++) {
                this.state["imageIsLoading" + posters[i].id] = true;
                this.state["modalMovie" + posters[i].id] = false;
                this.state["modalTrailer" + posters[i].id] = false;
            }
        }
    }

    handleHideModal = (modal) => {
        this.setState({[modal]: false});
    };

    handleShowModal = (modal) => {
        this.setState({[modal]: true});
    };

    imageLoaded = (id) => {
        let image = "imageIsLoading" + id;
        this.setState({[image]: false});
    };

    imageError = (e, id) => {
        let image = "imageIsLoading" + id;
        this.setState({[image]: false});

        e.target.src = require("./img/poster.png");
    };

    getMovieAge = (classif) => {
        if (classif) {
            return (classif === "livre" || classif === "L") ?
                <img alt={classif} src={require("./img/livre.png")}/> :
                <img alt={classif} src={require("./img/" + classif + "anos.png")}/>;
        }
    };

    getScore = (type, pont) => {
        if (type === "rt") {
            if (pont > 50) {
                return <span><img alt={type} src={require("./img/rt-1.png")}/> {pont}%</span>;
            } else {
                return <span><img alt={type} src={require("./img/rt-2.png")}/> {pont}%</span>;
            }
        } else if (type === "imdb") {
            return <span><img alt={type} src={require("./img/" + type + ".png")}/> {pont}/10</span>;
        } else if (type === "mc") {
            return <span><img alt={type} src={require("./img/" + type + ".png")}/> {pont}/100</span>;
        }
    };

    render() {
        const type = this.props.type;
        const posters = this.props.posters;

        if (!posters || posters.length === 0) {
            return (
                <section className="no-results">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <span role="img" aria-label="sad" className="icon">😥</span>
                            Não foram encontrados resultados para a pesquisa.
                        </div>
                    </div>
                </section>
            );
        }

        let classType = "poster " + type;
        return (
            <section classID="posters" className="posters-list">
                <div className="row">
                    {posters.map((poster) =>
                        <div className="col-md-4 poster-item" key={poster.id}>
                            <h2>{poster.title}</h2>
                            <p className="subtitle">({poster.subtitle ? poster.subtitle : poster.title})</p>
                            <div className={classType}>
                                {this.state["imageIsLoading" + poster.id] ? <Loading type={classType}/> : null}
                                <img alt={poster.title} className="img-fluid img-poster" src={poster.posterImage}
                                     onLoad={() => this.imageLoaded(poster.id)}
                                     onError={(e) => {
                                         this.imageError(e, poster.id)
                                     }}/>
                                <span className="movie-age">
                                    {this.getMovieAge(poster.movieAge)}
                                </span>
                                <div className="poster-footer">
                                    <div className="score-set">
                                        {poster.score && poster.score.map((score) =>
                                            (score.rating > 0) ? <span className="score" key={score.type}>
                                                    {this.getScore(score.type, score.rating)}
                                                </span> : null
                                        )}
                                    </div>
                                    <div className="screen-format">
                                        {poster.is3D && <img alt="3D" src={require("./img/3d.png")}/>}
                                        {poster.isIMAX && <img alt="IMAX" src={require("./img/imax.png")}/>}
                                    </div>
                                </div>
                                <div className="button-group">
                                    <a className="button"
                                       onClick={() => this.handleShowModal("modalMovie" + poster.id)}>
                                        <span className="fa fa-plus-circle" aria-hidden="true"/>
                                        Saiba mais
                                    </a>
                                    <a className={!poster.trailerURL ? "button disabled" : "button"}
                                       onClick={() => this.handleShowModal("modalTrailer" + poster.id)}>
                                        <span className="fa fa-play-circle" aria-hidden="true"/>
                                        Assistir Trailer
                                    </a>
                                    {type === "netflix" &&
                                    <a className={!poster.netflixURL ? "button disabled" : "button"}
                                       href={poster.netflixURL} target="_blank">
                                        <span className="fa fa-film" aria-hidden="true"/>
                                        Assistir na Netflix
                                    </a>}
                                    {type === "hbo-go" &&
                                    <a className={!poster.hbogoURL ? "button disabled" : "button"}
                                       href={poster.hbogoURL} target="_blank">
                                        <span className="fa fa-film" aria-hidden="true"/>
                                        Assistir na HBO Go
                                    </a>}
                                </div>
                            </div>
                            <GenericModal
                                estreiatype={type}
                                modaltype="modalMovie"
                                content={poster}
                                list={this.props.list}
                                show={this.state["modalMovie" + poster.id]}
                                onHide={() => this.handleHideModal("modalMovie" + poster.id)}
                            />
                            {poster.trailerURL && <GenericModal
                                estreiatype={type}
                                modaltype="modalTrailer"
                                content={poster}
                                show={this.state["modalTrailer" + poster.id]}
                                onHide={() => this.handleHideModal("modalTrailer" + poster.id)}
                            />}
                        </div>
                    )}
                </div>
            </section>
        );
    }
}

Posters.propTypes = {
    qtd: PropTypes.number,
    posters: PropTypes.array,
    list: PropTypes.object
};

export default Posters;
