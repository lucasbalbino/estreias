import React, {PureComponent} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Estreias from './Estreias';

import jsonData from './example.json';

class App extends PureComponent {

    render() {
        return (
            <div>
                <Router>
                    <div>
                        <Route path="/cinema" render={()=>
                            <Estreias type="cinema" title="Estreias do Cinema" json={jsonData}/>
                        }/>
                        <Route path="/dvd" render={()=>
                            <Estreias type="dvd" title="Estreias do DVD" json={jsonData}/>
                        }/>
                        <Route path="/netflix" render={()=>
                            <Estreias type="netflix" title="Estreias da Netflix" json={jsonData}/>
                        }/>
                        <Route path="/popcorntime" render={()=>
                            <Estreias type="popcorntime" title="Estreias do Popcorn Time" json={jsonData}/>
                        }/>
                    </div>
                </Router>
            </div>
        );
    }
}
export default App;
