import React, {PureComponent} from 'react';
import Header from './Header';
import Datepicker from './Datepicker';
import Posters from './Posters';
import Footer from './Footer';

import jsonData from './example.json';

class App extends PureComponent {

    render() {
        return (
            <div>
                <div className="container">
                    <Header titulo="Estreias do Cinema" />
                    <Datepicker periodo="16 de Novembro de 2017 - 22 de Novembro de 2017" />
                    <Posters qtd={jsonData.count} posters={jsonData.content} />
                </div>
                <Footer />
                {/*<Modals />*/}
            </div>
        );
    }
}
export default App;
