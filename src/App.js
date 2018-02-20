import React, {PureComponent} from 'react';
import Header from './Header';
import Datepicker from './Datepicker';
import Posters from './Posters';
import Footer from './Footer';

class App extends PureComponent {

    render() {
        return (
            <div>
                <div className="container">
                    <Header />
                    <Datepicker />
                    <Posters />
                </div>
                <Footer />
                {/*<Modals />*/}
            </div>
        );
    }
}
export default App;
