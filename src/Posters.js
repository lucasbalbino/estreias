import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import GenericModal from './GenericModal';

import './Posters.css'

class Posters extends PureComponent {
    constructor(props) {
        super(props);

        this.handleHideModal = this.handleHideModal.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);

        this.state = {};
        let posters = this.props.posters;
        for (let i = 0; i < posters.length; i++) {
            this.state["modalMovie" + posters[i].id] = false;
            this.state["modalTrailer" + posters[i].id] = false;
        }
    }

    handleHideModal = (modal) => {
        this.setState({[modal]: false});
    };

    handleShowModal = (modal) => {
        this.setState({[modal]: true});
    };

    getMovieAge = (classif) => {
        if (classif) {
            return <img alt={classif} src={require("./img/" + classif + "anos.png")}/>;
        }
    };

    getScore = (type, pont) => {
        if (type === "rt") {
            if (pont > 50) {
                return <span><img alt={type} src={require("./img/rt-1.png")}/> {pont}%</span>;
            } else {
                return <span><img alt={type} src={require("./img/rt-2.png")}/> {pont}%</span>;
            }
        } else {
            return <span><img alt={type} src={require("./img/" + type + ".png")}/> {pont}</span>;
        }
    };

    render() {
        const posters = this.props.posters;
        return (
            <section classID="posters" className="posters-list">
                <div className="row">
                    {posters.map((poster) =>
                        <div className="col-md-4 poster-item" key={poster.id}>
                            <h2>{poster.title}</h2>
                            <p className="subtitle">({poster.subtitle ? poster.subtitle : poster.title})</p>
                            <div className="poster">
                                <img alt={poster.title} className="img-fluid img-poster" src={poster.posterImage}/>
                                <span className="movie-age">
                                    {this.getMovieAge(poster.movieAge)}
                                </span>
                                <div className="poster-footer">
                                    <div className="score-set">
                                        {poster.score && poster.score.map((score) =>
                                            <span className="score" key={score.type}>
                                                {this.getScore(score.type, score.pontuation)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="screen-format">
                                        {poster.screenFormat && poster.screenFormat.map((format) =>
                                            <img alt={format} key={format}
                                                 src={require("./img/" + format + ".png")}/>
                                        )}
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
                                </div>
                            </div>
                            <GenericModal
                                type="modalMovie"
                                content={poster}
                                show={this.state["modalMovie" + poster.id]}
                                onHide={() => this.handleHideModal("modalMovie" + poster.id)}
                            />
                            {poster.trailerURL && <GenericModal
                                type="modalTrailer"
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
    posters: PropTypes.array
};

export default Posters;
