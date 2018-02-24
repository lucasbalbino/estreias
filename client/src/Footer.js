import React, {PureComponent} from 'react';
import {Link} from "react-router-dom";

import './Footer.css';

class Footer extends PureComponent {

    render() {
        return (
            <footer className={this.props.type}>
                <div className="container">
                    <div className="pull-left">
                        <h3>Estreias</h3>
                    </div>
                    <div className="menu pull-right">
                        <Link className="cinema" to="/cinema">Cinema</Link>
                        <Link className="dvd" to="/dvd">DVD</Link>
                        <br/>
                        <Link className="netflix" to="/netflix">Netflix</Link>
                        <Link className="popcorntime" to="/popcorntime">Popcorn Time</Link>
                    </div>
                </div>
            </footer>
        );
    }
}
export default Footer;
