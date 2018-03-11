import React, {PureComponent} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Estreias from './Estreias';
import Dashboards from './Dashboards';
import NotFound from './NotFound';

class App extends PureComponent {

    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route exact path="/" render={() =>
                            <Dashboards title="Estreias do Cinema, Netflix e HBO Go"/>
                        }/>
                        <Route exact path="/cinema" render={() =>
                            <Estreias type="cinema" title="Estreias do Cinema"/>
                        }/>
                        <Route exact path="/hbo-go" render={() =>
                            <Estreias type="hbo-go" title="Estreias da HBO Go"/>
                        }/>
                        <Route exact path="/netflix" render={() =>
                            <Estreias type="netflix" title="Estreias da Netflix"/>
                        }/>
                        <Route component={NotFound}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}
export default App;
