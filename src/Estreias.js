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
            loading: true
        };
    }

    componentDidMount() {
        setTimeout(() => this.setState({loading: false}), 1600);
    }

    componentWillReceiveProps() {
        this.setState({loading: true});
        setTimeout(() => this.setState({loading: false}), 1600);
    }

    render() {
        const type = this.props.type;
        const jsonData = this.props.json;
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
                    <Posters type={type} qtd={jsonData.count} posters={jsonData.content}/>
                </div>
                <Footer type={type}/>
            </div>
        );
    }
}

Estreias.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    jsonData: PropTypes.object
};

export default Estreias;
