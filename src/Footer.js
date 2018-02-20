import React, {PureComponent} from 'react';
import './Footer.css';

class Header extends PureComponent {

    render() {
        return (
            <footer>
                <div className="container">
                    <div className="pull-left">
                        <h3>Estreias</h3>
                    </div>
                    <div className="menu pull-right">
                        <button className="cinema" href="#">Cinema</button>
                        <button className="dvd" href="#">DVD</button>
                        <br/>
                        <button className="netflix" href="#">Netflix</button>
                        <button className="popcorn" href="#">Popcorn Time</button>
                    </div>
                </div>
            </footer>
        );
    }
}
export default Header;
