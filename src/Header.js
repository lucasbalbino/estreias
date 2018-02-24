import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import './Header.css';

class Header extends PureComponent {

    render() {
        return (
            <header>
                <h1 className={this.props.type}>{this.props.title}</h1>
            </header>
        );
    }
}

Header.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string
};

export default Header;
