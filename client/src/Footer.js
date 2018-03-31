import React, {PureComponent} from 'react';
import {Link} from "react-router-dom";
import moment from "moment";

import './Footer.css';

class Footer extends PureComponent {

    render() {
        let hoje = moment().format("YYYY");

        return (
            <footer className={this.props.type}>
                <div className="container">
                    <div className="title">
                        <h3><Link to="/">Estreias</Link></h3>
                    </div>
                    <div className="menu">
                        <Link className="cinema" to="/cinema">Cinema</Link>
                        <Link className="netflix" to="/netflix">Netflix</Link>
                        <Link className="hbo-go" to="/hbo-go">HBO Go</Link>
                    </div>
                    <div className="menu-small">
                        <Link className="" to="/sobre">Sobre</Link>
                        <Link className="" to="/contato">Contato</Link>
                        <span>© 2018 – {hoje} Estreias</span>
                    </div>
                </div>
            </footer>
        );
    }
}
export default Footer;
