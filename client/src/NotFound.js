import React, {PureComponent} from 'react';
import {Helmet} from "react-helmet";
import PropTypes from 'prop-types';

import Footer from './Footer';

class NotFound extends PureComponent {

    render() {
        return (
            <div>
                <Helmet>
                    <title>{this.props.title}</title>
                    <link rel="icon" type="image/png" href="favicon-todos.png"/>
                </Helmet>
                Não encontrei nada
                <Footer/>
            </div>
        );
    }
}

NotFound.propTypes = {
    title: PropTypes.string
};

export default NotFound;
