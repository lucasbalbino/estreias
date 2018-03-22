import React, {PureComponent} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Estreias from './Estreias';
import Dashboards from './Dashboards';
import NotFound from './NotFound';

class App extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            genres: [],
            country: [],
            distribution: []
        };
    }

    componentDidMount() {
        this.getGenres()
            .then(res => this.setState({genres: res}))
            .catch(err => console.log(err));
        this.getCountry()
            .then(res => this.setState({country: res}))
            .catch(err => console.log(err));
        this.getDistribution()
            .then(res => this.setState({distribution: res}))
            .catch(err => console.log(err));
    }

    getGenres = async () => {
        const response = await fetch("api/genres");
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    getCountry = async () => {
        const response = await fetch("api/country");
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    getDistribution = async () => {
        const response = await fetch("api/distribution");
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    render() {
        let list = {
            genres: this.state.genres,
            country: this.state.country,
            distribution: this.state.distribution
        };

        return (
            <div>
                <Router>
                    <Switch>
                        <Route exact path="/" render={() =>
                            <Dashboards title="Estreias do Cinema, Netflix e HBO Go"/>
                        }/>
                        <Route exact path="/cinema" render={() =>
                            <Estreias type="cinema" title="Estreias do Cinema" list={list}/>
                        }/>
                        <Route exact path="/hbo-go" render={() =>
                            <Estreias type="hbo-go" title="Estreias da HBO Go" list={list}/>
                        }/>
                        <Route exact path="/netflix" render={() =>
                            <Estreias type="netflix" title="Estreias da Netflix" list={list}/>
                        }/>
                        <Route component={NotFound}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}
export default App;
