import React, {PureComponent} from 'react';
import {Link} from "react-router-dom";

import './Footer.css';

class Footer extends PureComponent {

    render() {
        return (
            <footer className={this.props.type}>
                <div className="container">
                    <div className="pull-left">
                        <h3><Link to="/">Estreias</Link></h3>
                    </div>
                    <div className="menu pull-right">
                        <Link className="cinema" to="/cinema">Cinema</Link>
                        <Link className="netflix" to="/netflix">Netflix</Link>
                        <Link className="hbo-go" to="/hbo-go">HBO Go</Link>
                    </div>
                </div>
            </footer>
        );
    }
}
export default Footer;
