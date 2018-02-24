import React, {PureComponent} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Estreias from './Estreias';

class App extends PureComponent {

    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        {/*<Route exact path="/" render={() =>*/}
                        {/*<Estreias type="cinema" title="Estreias do Cinema" json={jsonData}/>*/}
                        {/*}/>*/}
                        <Route exact path="/cinema" render={() =>
                            <Estreias type="cinema" title="Estreias do Cinema"/>
                        }/>
                        <Route exact path="/dvd" render={() =>
                            <Estreias type="dvd" title="Estreias do DVD"/>
                        }/>
                        <Route exact path="/netflix" render={() =>
                            <Estreias type="netflix" title="Estreias da Netflix"/>
                        }/>
                        <Route exact path="/popcorntime" render={() =>
                            <Estreias type="popcorntime" title="Estreias do Popcorn Time"/>
                        }/>
                        {/*<Route component={NoMatch}/>*/}
                    </Switch>
                </Router>
            </div>
        );
    }
}
export default App;
