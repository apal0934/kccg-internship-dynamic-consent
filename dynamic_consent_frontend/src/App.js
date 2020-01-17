import { Route, HashRouter as Router, Switch } from "react-router-dom";

import AddConsent from "./Pages/Consent/AddConsent";
import AddUser from "./Pages/User/AddUser";
import Consents from "./Pages/Consent/Consents";
import Header from "./Components/Header";
import Landing from "./Pages/Landing";
import React from "react";
import User from "./Pages/User/User";
import Users from "./Pages/User/Users";

function App() {
    return (
        <div className="App">
            <Router>
                <Header />
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/user/list" component={Users} />
                    <Route exact path="/user/add" component={AddUser} />
                    <Route path="/user/:id" component={User} />
                    <Route path="/consent/list" component={Consents} />
                    <Route path="/consent/add" component={AddConsent} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
