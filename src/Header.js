import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import './Header.css';

class Header extends PureComponent {

    render() {
        return (
            <header>
                <h1>{this.props.titulo}</h1>
            </header>
        );
    }
}

Header.propTypes = {
    titulo: PropTypes.string
};

export default Header;
