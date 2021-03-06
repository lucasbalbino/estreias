import React, {PureComponent} from 'react';
import moment from 'moment';
import {Helmet} from "react-helmet";
import PropTypes from 'prop-types';

import Header from './Header';
import Datepicker from './Datepicker';
import Posters from './Posters';
import Footer from './Footer';
import Loading from './Loading';

import './Estreias.css';

class Estreias extends PureComponent {
    constructor(props) {
        super(props);

        this.changeDate = this.changeDate.bind(this);

        this.date = moment().format("YYYY-MM-DD");

        this.state = {
            json: "",
            loading: true
        };
    }

    callApi = async (type) => {
        const response = await fetch("api/estreias/" + type + "/" + this.date);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    changeDate = (newDate) => {
        this.date = newDate.format("YYYY-MM-DD");

        this.setState({json: "", loading: true});

        this.callApi(this.props.type)
            .then(res => this.setState({json: res, loading: false}))
            .catch(err => console.log(err));
    };

    componentDidMount() {
        window.scrollTo(0,0);
        this.callApi(this.props.type)
            .then(res => this.setState({json: res, loading: false}))
            .catch(err => console.log(err));
    }

    componentWillReceiveProps(nextProps) {
        window.scrollTo(0,0);
        this.setState({loading: true});

        this.callApi(nextProps.type)
            .then(res => this.setState({json: res, loading: false}))
            .catch(err => console.log(err));
    }

    render() {
        const type = this.props.type;
        const title = this.props.title;
        const titlePage = this.props.titlePage || this.props.title;

        if (this.state.loading) {
            return (
                <div>
                    <div className="container estreias">
                        <Header type={type} title={title}/>
                        <Loading type={type}/>
                    </div>
                    <Footer type={type}/>
                </div>
            );
        }

        const favicon = "img/favicon-" + type + ".png";

        return (
            <div>
                <Helmet>
                    <title>{titlePage}</title>
                    <link rel="icon" type="image/png" href={favicon}/>
                </Helmet>
                <div className="container estreias">
                    <Header type={type} title={title}/>
                    <Datepicker type={type} releaseDate={this.state.json.date || moment()}
                                change={this.changeDate} nextDate={this.state.json.nextDate}
                                previousDate={this.state.json.previousDate}/>
                    <Posters type={type} qtd={this.state.json.count} posters={this.state.json.content} list={this.props.list}/>
                </div>
                <Footer type={type}/>
            </div>
        );
    }
}

Estreias.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    titlePage: PropTypes.string,
    list: PropTypes.object
};

export default Estreias;
