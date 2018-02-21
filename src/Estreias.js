import React, {PureComponent} from 'react';
import Header from './Header';
import Datepicker from './Datepicker';
import Posters from './Posters';
import Footer from './Footer';
import PropTypes from 'prop-types';

class Estreias extends PureComponent {

    render() {
        const type = this.props.type;
        const jsonData = this.props.json;
        const title = this.props.title;

        return (
            <div>
                <div className="container">
                    <Header type={type} title={title}/>
                    <Datepicker type={type} releaseDate={new Date(2017, 10, 16)}/>
                    <Posters type={type} qtd={jsonData.count} posters={jsonData.content}/>
                </div>
                <Footer type={type} />
            </div>
        );
    }
}

Estreias.propTypes = {
    title: PropTypes.string
};

export default Estreias;
