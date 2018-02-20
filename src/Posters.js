import React, {PureComponent} from 'react';
import './Posters.css'

class Posters extends PureComponent {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <section classID="posters" className="posters-list">
                <div className="row">
                    <div className="col-md-4 poster-item">
                        <h2>Liga da Justiça</h2>
                        <p className="subtitle">(Justice League)</p>
                        <div className="poster">
                            <img alt="poster" className="img-fluid img-poster"
                                 src="https://fanart.tv/fanart/movies/141052/movieposter/justice-league-584f6a56c8c64.jpg"/>

                            <span className="movie-age">
                        <img alt="poster" src={require("./img/12anos.png")}/>
                    </span>
                            <div className="poster-footer">
                                <div className="score-set">
                                    <span className="score"><img alt="poster" src={require("./img/imdb.png")}/> 7.3</span>
                                    <span className="score"><img alt="poster" src={require("./img/rt-2.png")}/> 41%</span>
                                </div>
                                <div className="screen-format">
                                    <img alt="poster" src={require("./img/3d.png")}/>
                                    <img alt="poster" src={require("./img/imax.png")}/>
                                </div>
                            </div>
                            <div className="button-group">
                                <a className="button" href="#movie1" data-toggle="modal">
                                    <i className="fa fa-plus-circle" aria-hidden="true"/>
                                    Saiba mais
                                </a>
                                <a className="button" href="#trailer1" data-toggle="modal">
                                    <i className="fa fa-play-circle" aria-hidden="true"/>
                                    Assistir Trailer
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 poster-item">
                        <h2>On yoga - Arquitetura da paz</h2>
                        <p className="subtitle">(On yoga: The architecture of peace)</p>
                        <div className="poster">
                            <img alt="poster" className="img-fluid img-poster"
                                 src="http://www.filmeb.com.br/sites/default/files/styles/large/public/cartazes/filmebyoga.jpg"/>
                            <span className="movie-age">
                    </span>
                            <div className="poster-footer">
                                <div className="score-set">
                                    <span className="score"><img alt="poster" src={require("./img/imdb.png")}/> 8.5</span>
                                </div>
                                <div className="screen-format">
                                </div>
                            </div>
                            <div className="button-group">
                                <a className="button" href="#movie2" data-toggle="modal">
                                    <i className="fa fa-plus-circle" aria-hidden="true"/>
                                    Saiba mais
                                </a>
                                <a className="button" href="#trailer2">
                                    <i className="fa fa-play-circle" aria-hidden="true"/>
                                    Assistir Trailer
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 poster-item">
                        <h2>Colo</h2>
                        <p className="subtitle">(Colo)</p>
                        <div className="poster">
                            <img alt="poster" className="img-fluid img-poster"
                                 src="http://www.filmeb.com.br/sites/default/files/styles/large/public/cartazes/filmebcolo2.jpg"/>
                            <span className="movie-age">
                        <img alt="poster" src={require("./img/14anos.png")}/>
                    </span>
                            <div className="poster-footer">
                                <div className="score-set">
                                    <span className="score"><img alt="poster" src={require("./img/imdb.png")}/> 5.6</span>
                                </div>
                                <div className="screen-format">
                                </div>
                            </div>
                            <div className="button-group">
                                <a className="button" href="#movie3" data-toggle="modal">
                                    <i className="fa fa-plus-circle" aria-hidden="true"/>
                                    Saiba mais
                                </a>
                                <a className="button" href="#trailer3">
                                    <i className="fa fa-play-circle" aria-hidden="true"/>
                                    Assistir Trailer
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 poster-item">
                        <h2>On yoga - Arquitetura da paz</h2>
                        <p className="subtitle">(On yoga: The architecture of peace)</p>
                        <div className="poster">
                            <img alt="poster" className="img-fluid img-poster"
                                 src="http://www.filmeb.com.br/sites/default/files/styles/large/public/cartazes/filmebyoga.jpg"/>
                            <span className="movie-age">
                    </span>
                            <div className="poster-footer">
                                <div className="score-set">
                                    <span className="score"><img alt="poster" src={require("./img/imdb.png")}/> 8.5</span>
                                </div>
                                <div className="screen-format">
                                </div>
                            </div>
                            <div className="button-group">
                                <a className="button" href="#movie2">
                                    <i className="fa fa-plus-circle" aria-hidden="true"/>
                                    Saiba mais
                                </a>
                                <a className="button" href="#trailer2">
                                    <i className="fa fa-play-circle" aria-hidden="true"/>
                                    Assistir Trailer
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 poster-item">
                        <h2>Colo</h2>
                        <p className="subtitle">(Colo)</p>
                        <div className="poster">
                            <img alt="poster" className="img-fluid img-poster"
                                 src="http://www.filmeb.com.br/sites/default/files/styles/large/public/cartazes/filmebcolo2.jpg"/>
                            <span className="movie-age">
                        <img alt="poster" src={require("./img/14anos.png")}/>
                    </span>
                            <div className="poster-footer">
                                <div className="score-set">
                                    <span className="score"><img alt="poster" src={require("./img/imdb.png")}/> 5.6</span>
                                </div>
                                <div className="screen-format">
                                </div>
                            </div>
                            <div className="button-group">
                                <a className="button" href="#movie3">
                                    <i className="fa fa-plus-circle" aria-hidden="true"/>
                                    Saiba mais
                                </a>
                                <a className="button" href="#trailer3">
                                    <i className="fa fa-play-circle" aria-hidden="true"/>
                                    Assistir Trailer
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 poster-item">
                        <h2>On yoga - Arquitetura da paz</h2>
                        <p className="subtitle">(On yoga: The architecture of peace)</p>
                        <div className="poster">
                            <img alt="poster" className="img-fluid img-poster"
                                 src="http://www.filmeb.com.br/sites/default/files/styles/large/public/cartazes/filmebyoga.jpg"/>
                            <span className="movie-age">
                    </span>
                            <div className="poster-footer">
                                <div className="score-set">
                                    <span className="score"><img alt="poster" src={require("./img/imdb.png")}/> 8.5</span>
                                </div>
                                <div className="screen-format">
                                </div>
                            </div>
                            <div className="button-group">
                                <a className="button" href="#movie2">
                                    <i className="fa fa-plus-circle" aria-hidden="true"/>
                                    Saiba mais
                                </a>
                                <a className="button" href="#trailer2">
                                    <i className="fa fa-play-circle" aria-hidden="true"/>
                                    Assistir Trailer
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 poster-item">
                        <h2>Colo</h2>
                        <p className="subtitle">(Colo)</p>
                        <div className="poster">
                            <img alt="poster" className="img-fluid img-poster"
                                 src="http://www.filmeb.com.br/sites/default/files/styles/large/public/cartazes/filmebcolo2.jpg"/>
                            <span className="movie-age">
                        <img alt="poster" src={require("./img/14anos.png")}/>
                    </span>
                            <div className="poster-footer">
                                <div className="score-set">
                                    <span className="score"><img alt="poster" src={require("./img/imdb.png")}/> 5.6</span>
                                </div>
                                <div className="screen-format">
                                </div>
                            </div>
                            <div className="button-group">
                                <a className="button" href="#movie3">
                                    <i className="fa fa-plus-circle" aria-hidden="true"/>
                                    Saiba mais
                                </a>
                                <a className="button" href="#trailer3">
                                    <i className="fa fa-play-circle" aria-hidden="true"/>
                                    Assistir Trailer
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
export default Posters;
