import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch, Link } from "react-router-dom";

import Header from "./Components/Header";
import Users from "./Pages/User/Users";
import User from "./Pages/User/User";
import Consents from "./Pages/Consent/Consents";
import Landing from "./Pages/Landing";

function App() {
    return (
        <div className="App">
            <Router>
                <Header />
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route path="/users" component={Users} />
                    <Route path="/consents" component={Consents} />
                    <Route path="/user/:id" component={User} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
