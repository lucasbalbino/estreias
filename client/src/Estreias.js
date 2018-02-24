import React, {PureComponent} from 'react';
import Header from './Header';
import Datepicker from './Datepicker';
import Posters from './Posters';
import Footer from './Footer';
import Loading from './Loading';
import PropTypes from 'prop-types';

class Estreias extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            json: "",
            loading: true
        };
    }

    callApi = async (type) => {
        const response = await fetch('/type/' + type);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
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
                    <Loading type={type}/>
                    <Footer type={type}/>
                </div>
            );
        }

        return (
            <div>
                <div className="container">
                    <Header type={type} title={title}/>
                    <Datepicker type={type} releaseDate={new Date(2017, 10, 16)}/>
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
