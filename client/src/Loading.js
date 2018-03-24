import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import './Loading.css';

class Loading extends PureComponent {

    render() {
        return (
            <div id="loading" className={this.props.type}>
                <div className="sk-folding-cube">
                    <div className="sk-cube1 sk-cube"/>
                    <div className="sk-cube2 sk-cube"/>
                    <div className="sk-cube4 sk-cube"/>
                    <div className="sk-cube3 sk-cube"/>
                </div>
            </div>
        );
    }
}

Loading.propTypes = {
    type: PropTypes.string
};

export default Loading;
