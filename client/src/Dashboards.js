import React, {PureComponent} from 'react';
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";
import Moment from 'react-moment';
import moment from 'moment';
import VisibilitySensor from 'react-visibility-sensor';
import PropTypes from 'prop-types';

import Loading from './Loading';
import Footer from './Footer';

import './Dashboards.css';

class Dashboards extends PureComponent {
    constructor(props) {
        super(props);

        this.imageLoaded = this.imageLoaded.bind(this);
        this.imageError = this.imageError.bind(this);

        this.state = {
            "json": "",
            "loading": true,
            "isVisiblecinema": "",
            "isVisiblenetflix": "",
            "isVisiblehbo-go": ""
        };
    }

    imageLoaded = (id) => {
        let image = "imageIsLoading" + id;
        this.setState({[image]: false});
    };

    imageError = (e, id, type) => {
        let image = "imageIsLoading" + id;
        this.setState({[image]: false});

        e.target.src = "./img/poster-" + type + ".png";
    };

    getDate = (date) => {
        return (<span>
                <Moment format="DD/MM/YYYY" subtract={{days: 6}}>
                    {moment(date, "YYYY-MM-DD")}
                </Moment> - <Moment format="DD/MM/YYYY">
                    {moment(date, "YYYY-MM-DD")}
                </Moment>
            </span>);
    };

    onVisibleViewport = (isVisible, id) => {
        let vis = "isVisible" + id;
        this.setState({
            [vis]: isVisible ? " visible" : ""
        });
    };

    dash = (type, json, title, info) => {
        if (json) {
            let dashClass = "dash " + type;
            let coverClass = "cover " + type;
            let posterClass = "poster " + type;
            let link = "/" + type;

            let posters = json.content;

            return (
                <div className={dashClass}>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                <h2>{title}</h2>
                                <p className="qtd">{json.count} {json.count !== 1 ? "filmes" : "filme"}</p>
                                {(type === "cinema") ?
                                    <p className="label">semana</p> :
                                    <p className="label">últimos 7 dias</p>}
                                <p className="date">{this.getDate(json.date)}</p>
                            </div>

                            <VisibilitySensor
                                scrollCheck
                                onChange={isVisible => this.onVisibleViewport(isVisible, type)}
                                offset={{top: 750, bottom: 500}}
                                partialVisibility>

                                <div className={"col-md-8 posters-list" + this.state["isVisible" + type]}>
                                    <div className="row">
                                        {posters.map((poster, index) =>

                                            <div className={ (
                                                index === 4 ?
                                                    "col-lg-4 col-md-6 poster last" :
                                                    (index === 3 ? "col-lg-4 col-md-6 poster before-last" :
                                                        (index === 2 ? "col-lg-4 col-md-6 poster last-tablet" : "col-lg-4 col-md-6 poster"))
                                            ) } key={poster.id} itemScope itemType="http://schema.org/Movie">
                                                <h3 itemProp="name">{poster.title}</h3>
                                                <p className="subtitle">
                                                    (<span itemProp="alternateName">
                                                        {poster.subtitle ? poster.subtitle : poster.title}
                                                    </span>)
                                                </p>
                                                <div>
                                                    {this.state["imageIsLoading" + poster.id] ?
                                                        <Loading type={posterClass}/> : null}
                                                    <img alt={poster.title} className="img-fluid img-poster"
                                                         src={poster.posterImage} itemProp="image"
                                                         onLoad={() => this.imageLoaded(poster.id)}
                                                         onError={(e) => {
                                                             this.imageError(e, poster.id, type)
                                                         }}/>
                                                </div>
                                            </div>
                                        )}
                                        <Link className={coverClass} to={link}>
                                            <div className="info">
                                                <span>{info}</span>
                                                <span className="fa fa-chevron-circle-right" aria-hidden="true"/>
                                            </div>
                                        </Link>
                                    </div>

                                </div>

                            </VisibilitySensor>
                        </div>
                    </div>
                </div>
            )
        }
    };

    callApi = async () => {
        const response = await fetch("api/dashboard");
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        this.callApi()
            .then(res => this.setState({json: res, loading: false}))
            .catch(err => console.log(err));
    }

    render() {
        let result = this.state.json;

        if (this.state.loading) {
            let type = ["cinema", "netflix", "hbo-go"];
            let typeRandom = parseInt(Math.random() * 10, 10) % 3;

            return (
                <div>
                    <div className="container dashboard">
                        <Loading type={type[typeRandom]}/>
                    </div>
                    <Footer/>
                </div>
            );
        }

        return (
            <div>
                <Helmet>
                    <title>Lançamentos do Cinema, Netflix e HBO Go</title>
                    <link rel="icon" type="image/png" href="img/favicon.png"/>
                </Helmet>
                <div>
                    {this.dash("cinema", result["cinema"], "Estreias do Cinema", "Ver mais informações e trailers")}
                    {this.dash("netflix", result["netflix"], "Estreias da Netflix", "Ver mais informações, trailers e link direto para a Netflix")}
                    {this.dash("hbo-go", result["hbo-go"], "Estreias da HBO Go", "Ver mais informações, trailers e link direto para a HBO Go")}
                </div>
                <Footer/>
            </div>
        );
    }
}

Dashboards.propTypes = {
    title: PropTypes.string
};

export default Dashboards;
