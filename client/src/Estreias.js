import React, {PureComponent} from 'react';
import moment from 'moment';

import Header from './Header';
import Datepicker from './Datepicker';
import Posters from './Posters';
import Footer from './Footer';
import Loading from './Loading';

import PropTypes from 'prop-types';

class Estreias extends PureComponent {
    constructor(props) {
        super(props);

        this.changeDate = this.changeDate.bind(this);

        this.date = moment().format("DD-MM-YYYY");

        this.state = {
            json: "",
            loading: true
        };
    }

    callApi = async (type) => {
        const response = await fetch('api/estreias/' + type + "/" + this.date);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    changeDate = (newDate) => {
        this.date = newDate.format("DD-MM-YYYY");

        this.setState({json: "", loading: true});

        this.callApi(this.props.type)
            .then(res => this.setState({json: res, loading: false}))
            .catch(err => console.log(err));
    };

    componentDidMount() {
        this.callApi(this.props.type)
            .then(res => this.setState({json: res, loading: false}))
            .catch(err => console.log(err));
    }

    componentWillReceiveProps(nextProps) {
        this.setState({loading: true});

        this.callApi(nextProps.type)
            .then(res => this.setState({json: res, loading: false}))
            .catch(err => console.log(err));
    }

    render() {
        const type = this.props.type;
        const title = this.props.title;

        if (this.state.loading) {
            return (
                <div>
                    <div className="container">
                        <Header type={type} title={title}/>
                        <Loading type={type}/>
                    </div>
                    <Footer type={type}/>
                </div>
            );
        }

        return (
            <div>
                <div className="container">
                    <Header type={type} title={title}/>
                    <Datepicker type={type} releaseDate={this.state.json.date || moment()}
                                change={this.changeDate} nextDate={this.state.json.nextDate} previousDate={this.state.json.previousDate}/>
                    <Posters type={type} qtd={this.state.json.count} posters={this.state.json.content}/>
                </div>
                <Footer type={type}/>
            </div>
        );
    }
}

Estreias.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string
};

export default Estreias;
